import { Response } from 'express'
import { pdfService } from './pdf.service'
import { documentService } from '../document/document.service'
import type { AuthRequest } from '../../middlewares/auth.middleware'

export const pdfController = {

  // POST /api/pdf/analyze — Analyser un PDF et extraire les chapitres
  async analyze(req: AuthRequest, res: Response): Promise<void> {
    const file = (req as any).file
    if (!file) {
      res.status(400).json({ error: 'Aucun fichier PDF reçu' })
      return
    }

    try {
      const text = await pdfService.extractText(file.path)
      const result = await pdfService.analyzeWithAI(text)
      pdfService.cleanup(file.path)
      res.json({
        message: `Nous avons détecté ${result.totalChapters} chapitres — vous pouvez modifier avant de confirmer`,
        ...result
      })
    } catch (error: any) {
      pdfService.cleanup(file.path)
      res.status(500).json({ error: error.message })
    }
  },

  // POST /api/pdf/flashcards — Générer des fiches depuis un PDF
  async generateFlashcards(req: AuthRequest, res: Response): Promise<void> {
    const file = (req as any).file
    if (!file) {
      res.status(400).json({ error: 'Aucun fichier PDF reçu' })
      return
    }

    try {
      const text = await pdfService.extractText(file.path)
      const result = await pdfService.generateFlashcards(text)
      pdfService.cleanup(file.path)
      res.json(result)
    } catch (error: any) {
      pdfService.cleanup(file.path)
      res.status(500).json({ error: error.message })
    }
  },

  // POST /api/pdf/import — Importer les chapitres confirmés dans un module
  async importChapters(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { subjectId, chapters, fileName } = req.body
      if (!subjectId || !chapters || !Array.isArray(chapters)) {
        res.status(400).json({ error: 'subjectId et chapters (array) sont requis' })
        return
      }
      const subject = await pdfService.importChapters(req.userId!, subjectId, chapters)

      // Tracer le document importé pour ce module
      await documentService.create(req.userId!, subjectId, fileName || 'Document.pdf', chapters.length)

      res.json({
        message: `${chapters.length} chapitres importés avec succès`,
        subject
      })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }
}
