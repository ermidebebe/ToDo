import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors, jsonBodyParser } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    const userId=getUserId(event)
    const result=createTodo(userId,newTodo)
    return{
      statusCode:200,
      headers:{
        'Access-Control-Allow-Origin':'*'
      },
      body: JSON.stringify({item:result})
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
