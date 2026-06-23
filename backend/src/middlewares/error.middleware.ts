import { Request, Response, NextFunction } from 'express'
import { t } from '../utils/i18n'

// Gestionnaire d'erreur global — capte notamment les erreurs multer (fileFilter)
// qui ne passent pas par les try/catch des contrôleurs.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorMiddleware = (err: any, req: Request, res: Response, _next: NextFunction): void => {
  console.error(err)
  const message = err?.message ? t(err.message, req.locale) : t('common.unexpectedError', req.locale)
  res.status(err.status || 400).json({ error: message })
}