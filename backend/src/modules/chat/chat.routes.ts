import { Router } from 'express'
import { chatController } from './chat.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'

export const chatRoutes = Router()

chatRoutes.use(authMiddleware)

chatRoutes.post('/:subjectId/ask',       chatController.ask)
chatRoutes.get('/:subjectId/history',    chatController.getHistory)
chatRoutes.delete('/:subjectId/history', chatController.clearHistory)