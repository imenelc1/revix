// backend/src/config/authCookie.ts
import type { CookieOptions } from 'express'
import { ENV } from './env'

const isProd = ENV.NODE_ENV === 'production'

export const AUTH_COOKIE_NAME = 'token'

export function getAuthCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',                    
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}

export function getClearCookieOptions(): CookieOptions {
  const { maxAge, ...rest } = getAuthCookieOptions()
  return rest
}