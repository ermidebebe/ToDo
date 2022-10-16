import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

export class TodosAccess {
  dynamoDBClient: DocumentClient = new XAWS.DynamoDB.DocumentClient()
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

    logger.info(`returned todos ${todos}`)
    return todos.Items
  }

  async createTodo(todo: TodoItem) {
    const params: DocumentClient.PutItemInput = {
      TableName: this.todoTable,
      Item: todo
    }
    await this.dynamoDBClient.put(params).promise()
    logger.info(`new todo ${todo}`)
    return todo
  }

  async deleteTodo(todoId: string, userId: string) {
    logger.info(`deleted todo ${todoId}`)
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
    logger.info(`updated todo ${updatedTodo}`)
    const params: DocumentClient.UpdateItemInput = {
      TableName: this.todoTable,
      Key: {
        userId: userId,
        todoId: todoId
      },
      ExpressionAttributeNames: {
        '#name': 'name',
        '#dueDate': 'dueDate',
        '#done': 'done'
      },
      ExpressionAttributeValues: updatedTodo,
      UpdateExpression: 'SET #name = :name, #dueDate = :dueDate, #done = :done'
    }
    await this.dynamoDBClient.update(params).promise()
  }
}
