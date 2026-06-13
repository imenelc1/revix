import { Router } from 'express'
import { subjectController } from './subject.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'

export const subjectRoutes = Router()

// Toutes les routes sont protégées par JWT
subjectRoutes.use(authMiddleware)

// CRUD Modules
subjectRoutes.get('/',    subjectController.getAll)
subjectRoutes.get('/:id', subjectController.getOne)
subjectRoutes.post('/',   subjectController.create)
subjectRoutes.put('/:id', subjectController.update)
subjectRoutes.delete('/:id', subjectController.delete)

// CRUD Chapitres
subjectRoutes.post('/:id/chapters',                    subjectController.addChapter)
subjectRoutes.put('/:id/chapters/:chapterId',          subjectController.updateChapter)
subjectRoutes.delete('/:id/chapters/:chapterId',       subjectController.deleteChapter)
