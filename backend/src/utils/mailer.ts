import nodemailer from 'nodemailer'
import type SMTPTransport from 'nodemailer/lib/smtp-transport'
import { ENV } from '../config/env'

const smtpPort = Number(ENV.SMTP_PORT || 587)

const mailerOptions: SMTPTransport.Options = {
  host: ENV.SMTP_HOST,
  port: smtpPort,
  secure: smtpPort === 465,

  auth: {
    user: ENV.SMTP_USER,
    pass: ENV.SMTP_PASS?.trim()
  },

  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,

  logger: ENV.NODE_ENV !== 'production',
  debug: ENV.NODE_ENV !== 'production'
}

export const mailer = nodemailer.createTransport(mailerOptions)

let smtpVerified = false

async function verifySMTP() {
  if (smtpVerified) return

  try {
    console.log('Connexion SMTP...')

    await mailer.verify()

    smtpVerified = true

    console.log('SMTP connecté avec succès')
  } catch (error) {
    console.error('Erreur connexion SMTP:', error)
    throw error
  }
}

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string,
  locale: 'fr' | 'en'
) {
  if (!ENV.SMTP_HOST || !ENV.SMTP_USER || !ENV.SMTP_PASS) {
    if (ENV.NODE_ENV !== 'production') {
      console.info(`Lien de réinitialisation pour ${to}`)
      console.info(resetUrl)
      return
    }

    throw new Error('SMTP configuration missing')
  }

  const subject =
    locale === 'fr'
      ? 'Réinitialisation de votre mot de passe Revix'
      : 'Reset your Revix password'

  const html =
    locale === 'fr'
      ? `
      <div style="font-family: Arial, sans-serif;">
        <h2>Réinitialisation du mot de passe</h2>

        <p>Vous avez demandé la réinitialisation de votre mot de passe Revix.</p>

        <p>
          <a
            href="${resetUrl}"
            style="
              display:inline-block;
              padding:12px 20px;
              background:#2563eb;
              color:white;
              text-decoration:none;
              border-radius:8px;
            "
          >
            Réinitialiser mon mot de passe
          </a>
        </p>

        <p>Ce lien expire dans 1 heure.</p>

        <p>
          Si vous n'êtes pas à l'origine de cette demande,
          ignorez simplement cet email.
        </p>
      </div>
    `
      : `
      <div style="font-family: Arial, sans-serif;">
        <h2>Password Reset</h2>

        <p>You requested a password reset for your Revix account.</p>

        <p>
          <a
            href="${resetUrl}"
            style="
              display:inline-block;
              padding:12px 20px;
              background:#2563eb;
              color:white;
              text-decoration:none;
              border-radius:8px;
            "
          >
            Reset Password
          </a>
        </p>

        <p>This link expires in 1 hour.</p>

        <p>
          If you didn't request this,
          you can safely ignore this email.
        </p>
      </div>
    `

  try {
    await verifySMTP()

    const result = await mailer.sendMail({
      from: ENV.SMTP_FROM || ENV.SMTP_USER,
      to,
      subject,
      html
    })

    console.log('Email envoyé:', result.messageId)

    return result
  } catch (error) {
    console.error('Erreur envoi email reset:', error)

    if (ENV.NODE_ENV !== 'production') {
      console.info('Fallback URL:')
      console.info(resetUrl)
      return
    }

    throw new Error('Impossible d’envoyer l’email')
  }
}