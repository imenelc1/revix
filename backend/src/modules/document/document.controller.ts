import { Response } from 'express'
import { documentService } from './document.service'
import type { AuthRequest } from '../../middlewares/auth.middleware'

export const documentController = {
  async getBySubject(req: AuthRequest, res: Response): Promise<void> {
    try {
      const docs = await documentService.getBySubject(req.userId!, String(req.params.subjectId))
      res.json(docs)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  },

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await documentService.delete(req.userId!, String(req.params.id))
      res.json(result)
    } catch (error: any) {
      res.status(404).json({ error: error.message })
    }
  }
}
