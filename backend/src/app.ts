import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import session from 'express-session'
import passport from './config/google.strategy'

import { authRoutes }      from './modules/auth/auth.routes'
import { googleRoutes }    from './modules/auth/google.routes'
import { subjectRoutes }   from './modules/subject/subject.routes'
import { planningRoutes }  from './modules/planning/planning.routes'
import { pdfRoutes }       from './modules/pdf/pdf.routes'
import { flashcardRoutes } from './modules/flashcard/flashcard.routes'
import { ENV }             from './config/env'

const app = express()

app.use(helmet())
app.use(cors({
  origin: ENV.FRONTEND_URL,
  credentials: true,
}))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Session minimale requise par Passport (même avec JWT)
app.use(session({
  secret: ENV.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
}))

app.use(passport.initialize())

// Routes
app.use('/api/auth',       authRoutes)
app.use('/api/auth',       googleRoutes)   // /api/auth/google + /api/auth/google/callback
app.use('/api/subjects',   subjectRoutes)
app.use('/api/planning',   planningRoutes)
app.use('/api/pdf',        pdfRoutes)
app.use('/api/flashcards', flashcardRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'Revix API opérationnelle' })
})

export default app