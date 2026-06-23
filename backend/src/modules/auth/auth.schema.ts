import { z } from 'zod'

export const RegisterSchema = z.object({
    firstName: z.string().min(2, 'auth.firstNameTooShort'),
    lastName: z.string().min(2, 'auth.lastNameTooShort'),
    email: z.string().email('auth.invalidEmail'),
    password: z.string().min(8, 'auth.passwordMinLength')
})

export const LoginSchema = z.object({
  email: z.string().email('auth.invalidEmail'),
  password: z.string().min(1, 'auth.passwordRequired')
})

export type RegisterInput = z.infer<typeof RegisterSchema>
export type LoginInput = z.infer<typeof LoginSchema>

export const UpdateProfileSchema = z.object({
  firstName: z.string().min(2, 'auth.firstNameTooShort').optional(),
  lastName: z.string().min(2, 'auth.lastNameTooShort').optional()
})

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'auth.currentPasswordRequired'),
  newPassword: z.string().min(8, 'auth.newPasswordMinLength')
})

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>