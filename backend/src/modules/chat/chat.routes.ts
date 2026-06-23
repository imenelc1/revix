import { Router } from 'express'
import { chatController } from './chat.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { chatRateLimiter } from '../../middlewares/rateLimit.middleware'
export const chatRoutes = Router()

chatRoutes.use(authMiddleware)

chatRoutes.get('/:subjectId/history',    chatController.getHistory)
chatRoutes.delete('/:subjectId/history', chatController.clearHistory)
chatRoutes.post('/:subjectId/ask', chatRateLimiter, chatController.ask)