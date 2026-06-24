import { Resend } from 'resend'
import { ENV } from '../config/env'

const resend = new Resend(ENV.RESEND_API_KEY)

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string,
  locale: 'fr' | 'en'
) {
  if (!ENV.RESEND_API_KEY) {
    if (ENV.NODE_ENV !== 'production') {
      console.info(`Lien de réinitialisation pour ${to}`)
      console.info(resetUrl)
      return
    }
    throw new Error('RESEND_API_KEY manquant')
  }

  const subject = locale === 'fr'
    ? 'Réinitialisation de votre mot de passe Revix'
    : 'Reset your Revix password'

  const html = locale === 'fr'
    ? `<div style="font-family:Arial,sans-serif;">
        <h2>Réinitialisation du mot de passe</h2>
        <p>Vous avez demandé la réinitialisation de votre mot de passe Revix.</p>
        <a href="${resetUrl}" style="display:inline-block;padding:12px 20px;background:#6366f1;color:white;text-decoration:none;border-radius:8px;">
          Réinitialiser mon mot de passe
        </a>
        <p>Ce lien expire dans 1 heure.</p>
        <p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
      </div>`
    : `<div style="font-family:Arial,sans-serif;">
        <h2>Password Reset</h2>
        <p>You requested a password reset for your Revix account.</p>
        <a href="${resetUrl}" style="display:inline-block;padding:12px 20px;background:#6366f1;color:white;text-decoration:none;border-radius:8px;">
          Reset Password
        </a>
        <p>This link expires in 1 hour.</p>
        <p>If you didn't request this, ignore this email.</p>
      </div>`

  try {
    const result = await resend.emails.send({
      from: 'Revix <onboarding@resend.dev>',
      to,
      subject,
      html
    })
     console.log('RESEND RESULT =', result)
    console.log('Email envoyé:', result.data?.id)
    return result
  } catch (error) {
    console.error('Erreur envoi email:', error)
    if (ENV.NODE_ENV !== 'production') {
      console.info('Fallback URL:', resetUrl)
      return
    }
    throw new Error('email.sendFailed')
  }
}