import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { authRoutes } from './modules/auth/auth.routes'
import { subjectRoutes } from './modules/subject/subject.routes'
import { planningRoutes } from './modules/planning/planning.routes'
import { pdfRoutes } from './modules/pdf/pdf.routes'
import { flashcardRoutes } from './modules/flashcard/flashcard.routes'

const app = express()

app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRoutes)
app.use('/api/subjects', subjectRoutes)
app.use('/api/planning', planningRoutes)
app.use('/api/pdf', pdfRoutes)
app.use('/api/flashcards', flashcardRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Revix API opérationnelle' })
})

export default app
