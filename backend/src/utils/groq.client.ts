import Groq from 'groq-sdk'
import { ENV } from '../config/env'

export const groq = new Groq({
  apiKey: ENV.GROQ_API_KEY
})
