import { TodosAccess } from '../dataLayerLogic/todosAcess'
import { AttachmentUtils } from '../filestorageLogic/attachmentUtils'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'


const logger = createLogger('TodosAccess')
const todoaccess: TodosAccess = new TodosAccess()
const attachmentutils= new AttachmentUtils()

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
  logger.info('New Todo')
  logger.debug(newItem)

  return todoaccess.createTodo(newItem)
}

export function deleteTodo(todoId: string,userId:string) {
  todoaccess.deleteTodo(todoId,userId)
  logger.info('Todo deleted')
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

export function createAttachmentPresignedUrl(todoId: string) {
  return attachmentutils.generate_url(todoId)
}
