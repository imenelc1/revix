import { Router } from 'express'
import { documentController } from './document.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'

export const documentRoutes = Router()

documentRoutes.use(authMiddleware)

documentRoutes.post('/', documentController.create)
documentRoutes.get('/subject/:subjectId', documentController.getBySubject)
documentRoutes.delete('/:id', documentController.delete)