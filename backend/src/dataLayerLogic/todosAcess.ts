import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

//const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('TodosAccess')

export class TodosAccess {
  dynamoDBClient: DocumentClient = new AWS.DynamoDB.DocumentClient()
  todoTable: string = process.env.TODOS_TABLE
  async getTodos(userId: string) {
    const todos = await this.dynamoDBClient
      .query({
        TableName: this.todoTable,
        ExpressionAttributeValues: { ':userId': userId },
        KeyConditionExpression: 'userId = :userId',
        Select: 'ALL_ATTRIBUTES'
      })
      .promise()
    logger.info(todos)
    return todos.Items
  }

  async createTodo(todo: TodoItem) {
    const params: DocumentClient.PutItemInput = {
      TableName: this.todoTable,
      Item: todo
    }
    await this.dynamoDBClient.put(params).promise()
    logger.info('new todo', todo)
    return todo
  }

  async deleteTodo(todoId: string, userId: string) {
    await this.dynamoDBClient
      .delete({
        TableName: this.todoTable,
        Key: {
          userId: userId,
          todoId: todoId
        }
      })
      .promise()
  }

  async updateTodo(todoId: string, userId: string, updatedTodo: TodoUpdate) {
    const params: DocumentClient.UpdateItemInput = {
      TableName: this.todoTable,
      Key: {
        todoId: todoId,
        userId: userId
      },
      ExpressionAttributeNames: {
        '#name': 'name',
        '#dueDate': 'dueDate',
        '#done': 'done'
      },
      ExpressionAttributeValues: updatedTodo,
      UpdateExpression: 'SET #name = :name, #dueDate = :dueDate, #done = :done'
    }
    const result = await this.dynamoDBClient.update(params).promise()
    return result
  }
}
