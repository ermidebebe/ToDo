import { TodosAccess } from '../dataLayerLogic/todosAcess'
import { AttachmentUtils } from '../filestorageLogic/attachmentUtils'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'
import { integer } from 'aws-sdk/clients/backup'

const todoaccess: TodosAccess = new TodosAccess()
export function createTodo(userId: string, newTodo: CreateTodoRequest) {
  const todoId: string = uuid.v4()
  const newItem: TodoItem = {
    userId: userId,
    todoId: todoId,
    createdAt: newTodo['createdAt'],
    name: newTodo['name'],
    dueDate: newTodo['dueDate'],
    done: newTodo['done'],
    attachmentUrl: newTodo['attachmentUrl']
  }

  return todoaccess.createTodo(newItem)
}

export function deleteTodo(todoId: String) {
  console.log(todoId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({})
  }
}

export function updateTodo(
  userId: string,
  todoId: string,
  updatedTodo: UpdateTodoRequest
) {
  const newItem: TodoUpdate = {
    name: updatedTodo['name'],
    dueDate: updatedTodo['dueDate'],
    done: updateTodo['done']
  }

  return todoaccess.updateTodo(todoId, userId, newItem)
}

export function getTodosForUser(userId: string) {
  return todoaccess.getTodos(userId)
}

export function createAttachmentPresignedUrl(todoId: String, userId) {
  console.log(todoId, userId)
  return ''
}
