import rateLimit from 'express-rate-limit'
import { t } from '../utils/i18n'

// 10 tentatives / 15 min / IP — limite le brute-force sur login et register
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({ error: t('auth.tooManyAttempts', req.locale) })
  }
})
// 20 messages / 10 min / IP — protège le chatbot IA
export const chatRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({ error: t('pdf.rateLimitExceeded', req.locale) })
  }
})

// 10 analyses PDF / heure / IP — protège les appels Groq
export const pdfRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({ error: t('pdf.rateLimitExceeded', req.locale) })
  }
})

// 15 générations / heure / IP — protège flashcards et quiz
export const flashcardRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({ error: t('pdf.rateLimitExceeded', req.locale) })
  }
})