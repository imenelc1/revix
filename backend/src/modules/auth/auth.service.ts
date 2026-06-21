import jwt from 'jsonwebtoken'
import { User } from './auth.model'
import { ENV } from '../../config/env'
import type { RegisterInput, LoginInput } from './auth.schema'

export const authService = {

  async register(data: RegisterInput) {
    const existing = await User.findOne({ email: data.email })
    if (existing) throw new Error('Cet email est déjà utilisé')

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
    if (!user) throw new Error('Email ou mot de passe incorrect')

    const valid = await user.comparePassword(data.password)
    if (!valid) throw new Error('Email ou mot de passe incorrect')

    const token = generateToken(user.id)
    return { user: sanitizeUser(user), token }
  },

  async getMe(userId: string) {
    const user = await User.findById(userId)
    if (!user) throw new Error('Utilisateur introuvable')
    return sanitizeUser(user)
  },

  // ── Mettre à jour le profil (prénom / nom) ──────────────────────────────────
  async updateProfile(userId: string, data: { firstName?: string; lastName?: string }) {
    const user = await User.findById(userId)
    if (!user) throw new Error('Utilisateur introuvable')

    if (data.firstName) user.firstName = data.firstName
    if (data.lastName)  user.lastName  = data.lastName

    await user.save()
    return sanitizeUser(user)
  },

  // ── Changer le mot de passe ──────────────────────────────────────────────────
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await User.findById(userId)
    if (!user) throw new Error('Utilisateur introuvable')

    if (user.googleId && user.passwordHash.startsWith('google_')) {
      throw new Error('Les comptes connectés via Google ne peuvent pas changer de mot de passe ici')
    }

    const valid = await user.comparePassword(currentPassword)
    if (!valid) throw new Error('Mot de passe actuel incorrect')

    user.passwordHash = newPassword // re-hashé par le pre-save hook du modèle
    await user.save()

    return { message: 'Mot de passe mis à jour avec succès' }
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