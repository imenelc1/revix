import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  firstName:    string
  lastName:     string
  email:        string
  passwordHash: string
  googleId?:    string
  resetPasswordToken?:   string   
  resetPasswordExpires?: Date    
  createdAt:    Date
  comparePassword(password: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>({
  firstName:    { type: String, required: true, trim: true },
  lastName:     { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  googleId:     { type: String, sparse: true, unique: true },
  resetPasswordToken:   { type: String, sparse: true, select: false }, 
  resetPasswordExpires: { type: Date, select: false },                
}, { timestamps: true })

UserSchema.pre('save', async function () {
  if (!this.isModified('passwordHash')) return
  // Ne pas hasher les faux mots de passe Google
  if (this.passwordHash.startsWith('google_')) return
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12)
})

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  if (this.googleId && this.passwordHash.startsWith('google_')) return false
  return bcrypt.compare(password, this.passwordHash)
}

export const User = mongoose.model<IUser>('User', UserSchema)