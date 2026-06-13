import { Response } from 'express'
import { flashcardService } from './flashcard.service'
import type { AuthRequest } from '../../middlewares/auth.middleware'

export const flashcardController = {

  async generateFlashcards(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { subjectId, text, chapterId } = req.body
      if (!subjectId || !text) {
        res.status(400).json({ error: 'subjectId et text sont requis' })
        return
      }
      const flashcards = await flashcardService.generateFromText(req.userId!, subjectId, text, chapterId)
      res.status(201).json(flashcards)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  },

  async getFlashcards(req: AuthRequest, res: Response): Promise<void> {
    try {
      const flashcards = await flashcardService.getBySubject(req.userId!, String(req.params.subjectId))
      res.json(flashcards)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  },

  async deleteFlashcard(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await flashcardService.delete(req.userId!, String(req.params.id))
      res.json(result)
    } catch (error: any) {
      res.status(404).json({ error: error.message })
    }
  },

  async generateQuiz(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { subjectId, text, chapterId } = req.body
      if (!subjectId || !text) {
        res.status(400).json({ error: 'subjectId et text sont requis' })
        return
      }
      const quiz = await flashcardService.generateQuiz(req.userId!, subjectId, text, chapterId)
      res.status(201).json(quiz)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  },

  async getQuizzes(req: AuthRequest, res: Response): Promise<void> {
    try {
      const quizzes = await flashcardService.getQuizBySubject(req.userId!, String(req.params.subjectId))
      res.json(quizzes)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  },

  async submitQuiz(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { answers } = req.body
      if (!answers || !Array.isArray(answers)) {
        res.status(400).json({ error: 'answers (array) est requis' })
        return
      }
      const result = await flashcardService.submitQuiz(req.userId!, String(req.params.quizId), answers)
      res.json(result)
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }
}
