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
const attachmentutils = new AttachmentUtils()
const ATTACHMENT_S3_BUCKET=process.env.ATTACHMENT_S3_BUCKET

export async function createTodo(userId: string, newTodo: CreateTodoRequest) {
  const todoId: string = uuid.v4()
  const newItem: TodoItem = {
    userId: userId,
    todoId: todoId,
    name: newTodo['name'],
    dueDate: newTodo['dueDate'],
    attachmentUrl:  `https://${ATTACHMENT_S3_BUCKET}.s3.amazonaws.com/${todoId}`, 
    createdAt: new Date().getTime().toString(),
    done: false,
  }
  logger.info('new todo',newItem)

  return todoaccess.createTodo(newItem)
}

export async function deleteTodo(todoId: string, userId: string) {
  todoaccess.deleteTodo(todoId, userId)
}

export async function updateTodo(
  userId: string,
  todoId: string,
  updatedTodo: UpdateTodoRequest
)
{
  const newItem: TodoUpdate = {
    name: updatedTodo['name'],
    dueDate: updatedTodo['dueDate'],
    done: updateTodo['done']
  }

  return todoaccess.updateTodo(todoId, userId, newItem)
}

export async function getTodosForUser(userId: string){
  return todoaccess.getTodos(userId)
}

export async function createAttachmentPresignedUrl(todoId: string) {
  return attachmentutils.generate_url(todoId)
}
