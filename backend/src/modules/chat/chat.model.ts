import mongoose, { Document, Schema } from 'mongoose'

export type ChatRole = 'user' | 'assistant'

export interface IChatMessage extends Document {
  userId: mongoose.Types.ObjectId
  subjectId: mongoose.Types.ObjectId
  role: ChatRole
  content: string
  createdAt: Date
}

const ChatMessageSchema = new Schema<IChatMessage>({
  userId:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
  subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
  role:      { type: String, enum: ['user', 'assistant'], required: true },
  content:   { type: String, required: true }
}, { timestamps: { createdAt: true, updatedAt: false } })
ChatMessageSchema.index({ userId: 1, subjectId: 1, createdAt: 1 })
export const ChatMessage = mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema)
