import mongoose from 'mongoose'
import { ENV } from './env'

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(ENV.MONGODB_URI)
    console.log('MongoDB connecté')
  } catch (error) {
    console.error('Erreur MongoDB :', error)
    process.exit(1)
  }
}