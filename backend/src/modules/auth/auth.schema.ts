import { z } from 'zod'
import { isStrongPassword } from './password-policy'

const StrongPasswordSchema = z.string()
  .min(8, 'auth.passwordMinLength')
  .refine(isStrongPassword, 'auth.passwordWeak')

export const RegisterSchema = z.object({
    firstName: z.string().min(2, 'auth.firstNameTooShort'),
    lastName: z.string().min(2, 'auth.lastNameTooShort'),
    email: z.string().email('auth.invalidEmail'),
    password: StrongPasswordSchema
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
  newPassword: StrongPasswordSchema
})
export const ForgotPasswordSchema = z.object({
  email: z.string().email('auth.invalidEmail')
})

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'auth.resetTokenRequired'),
  newPassword: StrongPasswordSchema
})

export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>
