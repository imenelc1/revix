import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { authRoutes } from './modules/auth/auth.routes'

const app = express()

// Middlewares globaux
app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', authRoutes)

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Revix API opérationnelle ' })
})

export default app