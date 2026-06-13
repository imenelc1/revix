import { Response } from 'express'
import { planningService } from './planning.service'
import type { AuthRequest } from '../../middlewares/auth.middleware'

export const planningController = {

  async generate(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { availableDays, hoursPerDay, startHour } = req.body
      if (!availableDays || !hoursPerDay) {
        res.status(400).json({ error: 'availableDays et hoursPerDay sont requis' })
        return
      }
      const planning = await planningService.generate(req.userId!, {
        availableDays,
        hoursPerDay: Number(hoursPerDay),
        startHour: Number(startHour || 9)
      })
      res.status(201).json(planning)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },

  async get(req: AuthRequest, res: Response): Promise<void> {
    try {
      const planning = await planningService.get(req.userId!)
      res.json(planning)
    } catch (error: any) {
      res.status(404).json({ error: error.message })
    }
  },

  async getWeek(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { weekStart } = req.query
      if (!weekStart) { res.status(400).json({ error: 'weekStart requis' }); return }
      const sessions = await planningService.getWeek(req.userId!, String(weekStart))
      res.json(sessions)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },

  async updateSessionStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params
      const { status } = req.body
      if (!['completed', 'missed'].includes(status)) {
        res.status(400).json({ error: 'Status invalide. Utiliser: completed ou missed' })
        return
      }
      const planning = await planningService.updateSessionStatus(req.userId!, String(sessionId), status)
      res.json(planning)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  },

  async reschedule(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await planningService.reschedule(req.userId!)
      res.json(result)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }
}
