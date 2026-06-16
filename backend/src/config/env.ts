import dotenv from 'dotenv'
dotenv.config()

export const ENV = {
  PORT:                 process.env.PORT || 3000,
  MONGODB_URI:          process.env.MONGODB_URI || '',
  JWT_SECRET:           process.env.JWT_SECRET || 'dev_secret',
  JWT_EXPIRES_IN:       process.env.JWT_EXPIRES_IN || '7d',
  GROQ_API_KEY:         process.env.GROQ_API_KEY || '',
  NODE_ENV:             process.env.NODE_ENV || 'development',

  // ── Google OAuth ────────────────────────────────────────────────────────────
  GOOGLE_CLIENT_ID:     process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  GOOGLE_CALLBACK_URL:  process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback',

  // ── Frontend ────────────────────────────────────────────────────────────────
  FRONTEND_URL:         process.env.FRONTEND_URL || 'http://localhost:5173',
}