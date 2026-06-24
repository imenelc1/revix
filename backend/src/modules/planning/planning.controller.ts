import { Response } from 'express'
import { planningService } from './planning.service'
import { t } from '../../utils/i18n'
import type { AuthRequest } from '../../middlewares/auth.middleware'

export const planningController = {

  async generate(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { availableDays, hoursPerDay, startHour } = req.body
      if (!availableDays || !hoursPerDay) {
        res.status(400).json({ error: t('planning.availableDaysAndHoursRequired', req.locale) })
        return
      }
      const planning = await planningService.generate(req.userId!, {
        availableDays,
        hoursPerDay: Number(hoursPerDay),
        startHour: Number(startHour || 9)
      })
      res.status(201).json(planning)
    } catch (error: any) {
      res.status(400).json({ error: t(error.message, req.locale) })
    }
  },

  async get(req: AuthRequest, res: Response): Promise<void> {
    try {
      const planning = await planningService.get(req.userId!)
      res.json(planning)
    } catch (error: any) {
      res.status(404).json({ error: t(error.message, req.locale) })
    }
  },

  async getWeek(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { weekStart } = req.query
      if (!weekStart) { res.status(400).json({ error: t('planning.weekStartRequired', req.locale) }); return }
      const sessions = await planningService.getWeek(req.userId!, String(weekStart))
      res.json(sessions)
    } catch (error: any) {
      res.status(400).json({ error: t(error.message, req.locale) })
    }
  },

  async updateSessionStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params
      const { status } = req.body
      if (!['completed', 'missed'].includes(status)) {
        res.status(400).json({ error: t('planning.invalidStatus', req.locale) })
        return
      }
      const planning = await planningService.updateSessionStatus(req.userId!, String(sessionId), status)
      res.json(planning)
    } catch (error: any) {
      res.status(400).json({ error: t(error.message, req.locale) })
    }
  },

  async reschedule(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result: any = await planningService.reschedule(req.userId!)
      if (result?.message && !result?.sessions) {
        res.json({ message: t(result.message, req.locale) })
      } else {
        res.json(result)
      }
    } catch (error: any) {
      res.status(400).json({ error: t(error.message, req.locale) })
    }
  },
  async addSession(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { subjectId, chapterId, customTitle, date, startTime, durationMinutes } = req.body
      if (!date || !startTime || !durationMinutes) {
        res.status(400).json({ error: t('planning.sessionFieldsRequired', req.locale) })
        return
      }
      const planning = await planningService.addSession(req.userId!, {
        subjectId, chapterId, customTitle, date, startTime,
        durationMinutes: Number(durationMinutes)
      })
      res.status(201).json(planning)
    } catch (error: any) {
      res.status(400).json({ error: t(error.message, req.locale) })
    }
  },

  async updateSession(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params
      const { subjectId, chapterId, customTitle, date, startTime, durationMinutes } = req.body
      const planning = await planningService.updateSession(req.userId!, String(sessionId), {
        subjectId, chapterId, customTitle, date, startTime,
        durationMinutes: durationMinutes !== undefined ? Number(durationMinutes) : undefined
      })
      res.json(planning)
    } catch (error: any) {
      res.status(400).json({ error: t(error.message, req.locale) })
    }
  },

  async deleteSession(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { sessionId } = req.params
      const planning = await planningService.deleteSession(req.userId!, String(sessionId))
      res.json(planning)
    } catch (error: any) {
      res.status(400).json({ error: t(error.message, req.locale) })
    }
  }
}
