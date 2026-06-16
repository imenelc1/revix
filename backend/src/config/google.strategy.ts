import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { User } from '../modules/auth/auth.model'
import { ENV } from '../config/env'

passport.use(
  new GoogleStrategy(
    {
      clientID:     ENV.GOOGLE_CLIENT_ID,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET,
      callbackURL:  ENV.GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email     = profile.emails?.[0]?.value
        const firstName = profile.name?.givenName  || 'Utilisateur'
        const lastName  = profile.name?.familyName || ''
        const googleId  = profile.id

        if (!email) return done(new Error('Email Google introuvable'), undefined)

        // Chercher l'utilisateur existant par googleId ou email
        let user = await User.findOne({ $or: [{ googleId }, { email }] })

        if (user) {
          // Lier le compte Google si ce n'est pas déjà fait
          if (!user.googleId) {
            user.googleId = googleId
            await user.save()
          }
        } else {
          // Créer un nouvel utilisateur Google
          user = await User.create({
            firstName,
            lastName,
            email,
            googleId,
            // passwordHash vide — compte Google uniquement
            passwordHash: `google_${googleId}`,
          })
        }

        return done(null, user)
      } catch (error) {
        return done(error as Error, undefined)
      }
    }
  )
)

// Nécessaire pour Express session (même si on utilise JWT, Passport l'exige)
passport.serializeUser((user: any, done) => done(null, user._id))
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id)
  done(null, user)
})

export default passport