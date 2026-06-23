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