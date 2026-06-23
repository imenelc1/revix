import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { ENV } from '../config/env'
import { t } from '../utils/i18n'

export interface AuthRequest extends Request {
  userId?: string
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // Cookie en priorité, fallback sur Bearer header
  const authHeader = req.headers.authorization
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined
  const token = req.cookies?.token || bearerToken

  if (!token) {
    res.status(401).json({ error: t('auth.tokenMissing', req.locale) })
    return
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as { id: string }
    req.userId = decoded.id
    next()
  } catch {
    res.status(401).json({ error: t('auth.tokenInvalid', req.locale) })
  }
}
