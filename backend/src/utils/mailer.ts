import nodemailer from 'nodemailer'
import type SMTPTransport from 'nodemailer/lib/smtp-transport'
import dns from 'dns'
import { ENV } from '../config/env'

interface CustomSMTPOptions extends SMTPTransport.Options {
  dnsLookup?: (
    hostname: string,
    options: dns.LookupOneOptions,
    callback: (err: NodeJS.ErrnoException | null, address: string, family: number) => void
  ) => void
}

const mailerOptions: CustomSMTPOptions = {
  host: ENV.SMTP_HOST,
  port: parseInt(ENV.SMTP_PORT as unknown as string, 10) || 587,
  secure: parseInt(ENV.SMTP_PORT as unknown as string, 10) === 465,
  auth: {
    user: ENV.SMTP_USER,
    pass: ENV.SMTP_PASS?.trim()
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  dnsLookup: (hostname, options, callback) => {
    dns.lookup(hostname, { family: 4 }, (err, address, family) => {
      callback(err, address, family)
    })
  }
}

export const mailer = nodemailer.createTransport(mailerOptions as any)

export async function sendPasswordResetEmail(to: string, resetUrl: string, locale: 'fr' | 'en') {
  if (!ENV.SMTP_HOST || !ENV.SMTP_USER || !ENV.SMTP_PASS) {
    if (ENV.NODE_ENV !== 'production') {
      console.info(`Lien de réinitialisation pour ${to}: ${resetUrl}`)
      return
    }
    throw new Error('SMTP configuration missing')
  }

  const subject = locale === 'fr'
    ? 'Réinitialisation de votre mot de passe Revix'
    : 'Reset your Revix password'

  const html = locale === 'fr'
    ? `<p>Vous avez demandé la réinitialisation de votre mot de passe Revix.</p>
       <p><a href="${resetUrl}">Cliquez ici pour choisir un nouveau mot de passe</a></p>
       <p>Ce lien expire dans 1 heure. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>`
    : `<p>You requested a password reset for your Revix account.</p>
       <p><a href="${resetUrl}">Click here to choose a new password</a></p>
       <p>This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>`

  await mailer.sendMail({ from: ENV.SMTP_FROM, to, subject, html })
}