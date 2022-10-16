import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { deleteTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
const logger = createLogger('deleteTodo')

export const handler = 
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId:string = event.pathParameters.todoId
    const userId:string=getUserId(event)
    await deleteTodo(todoId,userId)
    logger.info(`Todo with ${todoId} has been deleted`)
    return{
      statusCode:200,
      headers:{
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({})
    }
    
  }