import { Router } from 'express'
import { flashcardController } from './flashcard.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'

export const flashcardRoutes = Router()

flashcardRoutes.use(authMiddleware)

// Flashcards
flashcardRoutes.post('/generate',                        flashcardController.generateFlashcards)
flashcardRoutes.get('/subject/:subjectId',               flashcardController.getFlashcards)
flashcardRoutes.delete('/:id',                           flashcardController.deleteFlashcard)

// Quiz
flashcardRoutes.post('/quiz/generate',                   flashcardController.generateQuiz)
flashcardRoutes.get('/quiz/subject/:subjectId',          flashcardController.getQuizzes)
flashcardRoutes.post('/quiz/:quizId/submit',             flashcardController.submitQuiz)
