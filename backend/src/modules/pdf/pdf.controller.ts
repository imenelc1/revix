import { Response } from 'express'
import { pdfService } from './pdf.service'
import { documentService } from '../document/document.service'
import { t } from '../../utils/i18n'
import type { AuthRequest } from '../../middlewares/auth.middleware'

export const pdfController = {

  async analyze(req: AuthRequest, res: Response): Promise<void> {
  const file = (req as any).file
  if (!file) { res.status(400).json({ error: t('pdf.noFileReceived', req.locale) }); return }

  try {
    const text = await pdfService.extractText(file.path)
    const result = await pdfService.analyzeWithAI(text)
    pdfService.cleanup(file.path)
    res.json({
      message: t('pdf.chaptersDetectedMessage', req.locale, { count: result.totalChapters }),
      extractedText: text,
      ...result
    })
  } catch (error: any) {
    pdfService.cleanup(file.path)
    res.status(500).json({ error: t(error.message, req.locale) })
  }
},

  async generateFlashcards(req: AuthRequest, res: Response): Promise<void> {
    const file = (req as any).file
    if (!file) {
      res.status(400).json({ error: t('pdf.noFileReceived', req.locale) })
      return
    }
    try {
      const text = await pdfService.extractText(file.path)
      const result = await pdfService.generateFlashcards(text)
      pdfService.cleanup(file.path)
      res.json(result)
    } catch (error: any) {
      pdfService.cleanup(file.path)
      res.status(500).json({ error: t(error.message, req.locale) })
    }
  },

  async importChapters(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { subjectId, chapters, fileName, extractedText } = req.body
    if (!subjectId || !chapters || !Array.isArray(chapters)) {
      res.status(400).json({ error: t('pdf.subjectAndChaptersRequired', req.locale) })
      return
    }
    const subject = await pdfService.importChapters(req.userId!, subjectId, chapters)
    await documentService.create(req.userId!, subjectId, fileName || 'Document.pdf', chapters.length, extractedText)

    res.json({
      message: t('pdf.chaptersImportedMessage', req.locale, { count: chapters.length }),
      subject
    })
  } catch (error: any) {
    res.status(400).json({ error: t(error.message, req.locale) })
  }
}
}