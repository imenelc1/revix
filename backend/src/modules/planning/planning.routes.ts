import { Router } from 'express'
import { planningController } from './planning.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'

export const planningRoutes = Router()

planningRoutes.use(authMiddleware)

// Générer le planning
planningRoutes.post('/generate', planningController.generate)

// Récupérer le planning complet
planningRoutes.get('/', planningController.get)

// Récupérer les sessions d'une semaine
planningRoutes.get('/week', planningController.getWeek)

// Marquer une session comme complétée ou ratée
planningRoutes.patch('/sessions/:sessionId/status', planningController.updateSessionStatus)

// Déclencher le rattrapage automatique
planningRoutes.post('/reschedule', planningController.reschedule)
