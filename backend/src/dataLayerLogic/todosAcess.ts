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
  todoTable: string =process.env.TODOS_TABLE
  async getTodos(userId: string) {
    
    const todos = await this.dynamoDBClient
      .query({
        TableName: this.todoTable,
        ExpressionAttributeValues: {
          ":userId": {
            S: userId
           }
         }, 
         KeyConditionExpression: "userId = :userId", 
        Select: "ALL_ATTRIBUTES", 
      })
      .promise()
    logger.debug(todos)
    return todos
  }

  async createTodo(todo: TodoItem) {
    const params: DocumentClient.PutItemInput = {
      TableName: this.todoTable,
      Item: todo,
      ReturnValues: 'ALL_NEW'
    }
    const result = await this.dynamoDBClient.put(params).promise()
    return result
  }

  async deleteTodo(todoId: string, userId: string) {
    const params: DocumentClient.DeleteItemInput = {
      TableName: this.todoTable,
      Key: {
        todoId:todoId ,
        userId:userId
      }
    }
    const result = await this.dynamoDBClient.delete(
      params).promise()
    return result
  }

  async updateTodo(todoId: string, userId: string, updatedTodo: TodoUpdate) {
    const params: DocumentClient.UpdateItemInput = {
      TableName: this.todoTable,
      Key: {
        todoId: todoId ,
        userId: userId
      },
      ExpressionAttributeNames: {
        '#name': 'name',
        '#dueDate': 'dueDate',
        '#done': 'done'
      },
      ExpressionAttributeValues: updatedTodo,
      ReturnValues: 'ALL_NEW',
      UpdateExpression: 'SET #name = :name, #dueDate = :dueDate, #done = :done'
    }
    const result = await this.dynamoDBClient.update(
      params
    ).promise()
    return result
  }
}
