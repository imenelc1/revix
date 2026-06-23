import { Router } from 'express'
import multer from 'multer'
import { flashcardController } from './flashcard.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { flashcardRateLimiter } from '../../middlewares/rateLimit.middleware'
const upload = multer({
  dest: '/tmp',
  fileFilter: (req, file, cb) => {
    cb(null, file.mimetype === 'application/pdf')
  },
  limits: { fileSize: 10 * 1024 * 1024 }
})

export const flashcardRoutes = Router()

flashcardRoutes.use(authMiddleware)

// Flashcards depuis texte
flashcardRoutes.post('/generate', flashcardController.generateFlashcards)
// Flashcards depuis PDF complet
flashcardRoutes.post('/generate-from-pdf', upload.single('pdf'), flashcardController.generateFlashcardsFromPdf)

flashcardRoutes.get('/subject/:subjectId', flashcardController.getFlashcards)
flashcardRoutes.delete('/:id', flashcardController.deleteFlashcard)

// Quiz depuis texte
flashcardRoutes.post('/generate', flashcardRateLimiter, flashcardController.generateFlashcards)
flashcardRoutes.post('/generate-from-pdf', flashcardRateLimiter, upload.single('pdf'), flashcardController.generateFlashcardsFromPdf)
flashcardRoutes.get('/quiz/subject/:subjectId', flashcardController.getQuizzes)
flashcardRoutes.get('/quiz/:quizId', flashcardController.getQuizById)
flashcardRoutes.post('/quiz/:quizId/submit', flashcardController.submitQuiz)
flashcardRoutes.delete('/quiz/:id', flashcardController.deleteQuiz)
