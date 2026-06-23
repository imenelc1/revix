import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { pdfController } from './pdf.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { pdfRateLimiter } from '../../middlewares/rateLimit.middleware'
// Config multer — stockage local temporaire
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/tmp')
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, unique + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('pdf.onlyPdfAccepted'))
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }
})

export const pdfRoutes = Router()

pdfRoutes.use(authMiddleware)



// Importer les chapitres confirmés dans un module
pdfRoutes.post('/import',pdfRateLimiter, pdfController.importChapters)
pdfRoutes.post('/analyze', pdfRateLimiter, upload.single('pdf'), pdfController.analyze)
pdfRoutes.post('/flashcards', pdfRateLimiter, upload.single('pdf'), pdfController.generateFlashcards)