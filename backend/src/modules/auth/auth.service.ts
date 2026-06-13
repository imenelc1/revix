import jwt from 'jsonwebtoken'
import { User } from './auth.model'
import { ENV } from '../../config/env'
import type { RegisterInput, LoginInput } from './auth.schema'

export const authService = {

  async register(data: RegisterInput) {
    // Vérifier si l'email existe déjà
    const existing = await User.findOne({ email: data.email })
    if (existing) throw new Error('Cet email est déjà utilisé')

    // Créer l'utilisateur
    const user = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      passwordHash: data.password // sera hashé par le pre-save hook
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
  }
}

// Génère un JWT
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
    createdAt: user.createdAt
  }
}
