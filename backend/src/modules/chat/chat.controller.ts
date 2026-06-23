import { Response } from 'express'
import { chatService } from './chat.service'
import { AskSchema } from './chat.schema'
import { t, translateZodErrors } from '../../utils/i18n'
import type { AuthRequest } from '../../middlewares/auth.middleware'

export const chatController = {

  async ask(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = AskSchema.parse(req.body)
      const message = await chatService.ask(req.userId!, String(req.params.subjectId), data.question)
      res.status(201).json(message)
    } catch (error: any) {
      if (error.name === 'ZodError') {
        res.status(400).json({ error: translateZodErrors(error.errors, req.locale) })
        return
      }
      res.status(400).json({ error: t(error.message, req.locale) })
    }
  },

  async getHistory(req: AuthRequest, res: Response): Promise<void> {
    try {
      const history = await chatService.getHistory(req.userId!, String(req.params.subjectId))
      res.json(history)
    } catch (error: any) {
      res.status(400).json({ error: t(error.message, req.locale) })
    }
  },

  async clearHistory(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await chatService.clearHistory(req.userId!, String(req.params.subjectId))
      res.json({ message: t(result.message, req.locale) })
    } catch (error: any) {
      res.status(400).json({ error: t(error.message, req.locale) })
    }
  }
}