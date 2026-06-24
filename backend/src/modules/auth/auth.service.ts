import jwt from 'jsonwebtoken'
import { User } from './auth.model'
import { ENV } from '../../config/env'
import type { RegisterInput, LoginInput } from './auth.schema'
import crypto from 'crypto'
import { sendPasswordResetEmail } from '../../utils/mailer'
export const authService = {

  async register(data: RegisterInput) {
    const existing = await User.findOne({ email: data.email })
    if (existing) throw new Error('auth.emailAlreadyUsed')

    const user = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      passwordHash: data.password
    })

    const token = generateToken(user.id)
    return { user: sanitizeUser(user), token }
  },

  async login(data: LoginInput) {
    const user = await User.findOne({ email: data.email })
    if (!user) throw new Error('auth.invalidCredentials')

    const valid = await user.comparePassword(data.password)
    if (!valid) throw new Error('auth.invalidCredentials')

    const token = generateToken(user.id)
    return { user: sanitizeUser(user), token }
  },

  async getMe(userId: string) {
    const user = await User.findById(userId)
    if (!user) throw new Error('auth.userNotFound')
    return sanitizeUser(user)
  },

  // ── Mettre à jour le profil (prénom / nom) ──────────────────────────────────
  async updateProfile(userId: string, data: { firstName?: string; lastName?: string }) {
    const user = await User.findById(userId)
    if (!user) throw new Error('auth.userNotFound')

    if (data.firstName) user.firstName = data.firstName
    if (data.lastName)  user.lastName  = data.lastName

    await user.save()
    return sanitizeUser(user)
  },

  // ── Changer le mot de passe ──────────────────────────────────────────────────
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await User.findById(userId)
    if (!user) throw new Error('auth.userNotFound')

    if (user.googleId && user.passwordHash.startsWith('google_')) {
      throw new Error('auth.googleAccountCannotChangePassword')
    }

    const valid = await user.comparePassword(currentPassword)
    if (!valid) throw new Error('auth.currentPasswordIncorrect')

    user.passwordHash = newPassword // re-hashé par le pre-save hook du modèle
    await user.save()

    return { message: 'auth.passwordUpdated' }
  },
  // ── Demander la réinitialisation du mot de passe ─────────────────────────────
  async forgotPassword(email: string, locale: 'fr' | 'en') {
    const user = await User.findOne({ email })

    // On répond toujours la même chose pour ne pas révéler si l'email existe
    if (!user || (user.googleId && user.passwordHash.startsWith('google_'))) {
      return { message: 'auth.resetEmailSentIfExists' }
    }

    const token = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex')
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000) // 1h
    await user.save()

    const resetUrl = `${ENV.FRONTEND_URL}/reset-password?token=${token}`
    sendPasswordResetEmail(user.email, resetUrl, locale).catch(err =>
      console.error('Erreur envoi email reset:', err)
    )

    return { message: 'auth.resetEmailSentIfExists' }
  },

  // ── Réinitialiser le mot de passe avec le token reçu par email ───────────────
  async resetPassword(token: string, newPassword: string) {
    const hashed = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: new Date() }
    }).select('+resetPasswordToken +resetPasswordExpires')

    if (!user) throw new Error('auth.resetTokenInvalid')

    user.passwordHash = newPassword // re-hashé par le hook pre-save
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    return { message: 'auth.passwordUpdated' }
  }
}


function generateToken(userId: string): string {
  return jwt.sign({ id: userId }, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN
  } as jwt.SignOptions)
}

// Retire le passwordHash avant d'envoyer au client
function sanitizeUser(user: any) {
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    createdAt: user.createdAt,
    isGoogleAccount: !!user.googleId
  }
}
