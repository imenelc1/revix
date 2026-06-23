import { Response } from 'express'
import { documentService } from './document.service'
import { t } from '../../utils/i18n'
import type { AuthRequest } from '../../middlewares/auth.middleware'

export const documentController = {

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { subjectId, fileName, chaptersGenerated, extractedText } = req.body
      if (!subjectId || !fileName) {
        res.status(400).json({ error: t('document.subjectAndFileNameRequired', req.locale) })
        return
      }
      const doc = await documentService.create(
        req.userId!,
        subjectId,
        fileName,
        Number(chaptersGenerated) || 0,
        extractedText
      )
      res.status(201).json(doc)
    } catch (error: any) {
      res.status(400).json({ error: t(error.message, req.locale) })
    }
  },

  async getBySubject(req: AuthRequest, res: Response): Promise<void> {
    try {
      const docs = await documentService.getBySubject(req.userId!, String(req.params.subjectId))
      res.json(docs)
    } catch (error: any) {
      res.status(500).json({ error: t(error.message, req.locale) })
    }
  },

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await documentService.delete(req.userId!, String(req.params.id))
      res.json({ message: t(result.message, req.locale) })
    } catch (error: any) {
      res.status(404).json({ error: t(error.message, req.locale) })
    }
  }
}