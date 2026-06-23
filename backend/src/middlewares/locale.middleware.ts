import { Request, Response, NextFunction } from 'express'
import type { Locale } from '../utils/i18n'

declare global {
  namespace Express {
    interface Request {
      locale: Locale
    }
  }
}

export const localeMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  const header = req.headers['x-locale']
  const value = Array.isArray(header) ? header[0] : header
  req.locale = value === 'en' ? 'en' : 'fr'
  next()
}