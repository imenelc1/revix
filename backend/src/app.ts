import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import passport from './config/google.strategy'

import { authRoutes }      from './modules/auth/auth.routes'
import { googleRoutes }    from './modules/auth/google.routes'
import { subjectRoutes }   from './modules/subject/subject.routes'
import { planningRoutes }  from './modules/planning/planning.routes'
import { pdfRoutes }       from './modules/pdf/pdf.routes'
import { flashcardRoutes } from './modules/flashcard/flashcard.routes'
import { documentRoutes }  from './modules/document/document.routes'
import { localeMiddleware } from './middlewares/locale.middleware'
import { errorMiddleware }  from './middlewares/error.middleware'
import { ENV }             from './config/env'
import { chatRoutes }      from './modules/chat/chat.routes'
import cookieParser from 'cookie-parser'
const app = express()
app.set('trust proxy', 1)
app.set('etag', false)
const allowedOrigins = new Set([
  ...ENV.FRONTEND_URLS,
  ...(ENV.NODE_ENV !== 'production' ? ['http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'] : [])
])

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      callback(null, true)
      return
    }

    if (allowedOrigins.has(origin)) {
      callback(null, true)
      return
    }

    console.log('CORS blocked:', origin)

    callback(new Error('cors.originNotAllowed'))
  },
  credentials: true
}))

app.use(helmet())

app.use(morgan('dev'))
app.use(cookieParser())
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: true, limit: '5mb' }))
app.use(localeMiddleware)

app.use('/api', (_req, res, next) => {
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
    'Surrogate-Control': 'no-store',
  })
  next()
})

app.use(passport.initialize())

// Routes
app.use('/api/auth',       authRoutes)
app.use('/api/auth',       googleRoutes)   // /api/auth/google + /api/auth/google/callback
app.use('/api/subjects',   subjectRoutes)
app.use('/api/planning',   planningRoutes)
app.use('/api/pdf',        pdfRoutes)
app.use('/api/flashcards', flashcardRoutes)
app.use('/api/documents',  documentRoutes)
app.use('/api/chat', chatRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'Revix API opérationnelle' })
})

app.use(errorMiddleware)

export default app
