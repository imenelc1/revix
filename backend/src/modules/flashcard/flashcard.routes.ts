import { Router } from 'express'
import multer from 'multer'
import { flashcardController } from './flashcard.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'

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
flashcardRoutes.post('/quiz/generate', flashcardController.generateQuiz)
// Quiz depuis PDF complet
flashcardRoutes.post('/quiz/generate-from-pdf', upload.single('pdf'), flashcardController.generateQuizFromPdf)

flashcardRoutes.get('/quiz/subject/:subjectId', flashcardController.getQuizzes)
flashcardRoutes.post('/quiz/:quizId/submit', flashcardController.submitQuiz)
flashcardRoutes.delete('/quiz/:id', flashcardController.deleteQuiz)
