import { z } from 'zod'

export const RegisterSchema = z.object({
  firstName: z.string().min(2, 'Prénom trop court'),
  lastName: z.string().min(2, 'Nom trop court'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Mot de passe minimum 8 caractères')
})

export const LoginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis')
})

export type RegisterInput = z.infer<typeof RegisterSchema>
export type LoginInput = z.infer<typeof LoginSchema>
export const UpdateProfileSchema = z.object({
  firstName: z.string().min(2, 'Prénom trop court').optional(),
  lastName: z.string().min(2, 'Nom trop court').optional()
})

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Mot de passe actuel requis'),
  newPassword: z.string().min(8, 'Le nouveau mot de passe doit contenir au moins 8 caractères')
})

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>