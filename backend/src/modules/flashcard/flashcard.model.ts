import mongoose, { Document, Schema } from 'mongoose'

export interface IFlashcard extends Document {
  userId: mongoose.Types.ObjectId
  subjectId: mongoose.Types.ObjectId
  chapterId?: mongoose.Types.ObjectId
  question: string
  answer: string
  createdAt: Date
}

export interface IQuizQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface IQuiz extends Document {
  userId: mongoose.Types.ObjectId
  subjectId: mongoose.Types.ObjectId
  chapterId?: mongoose.Types.ObjectId
  questions: IQuizQuestion[]
  userScore?: number
  createdAt: Date
}

const FlashcardSchema = new Schema<IFlashcard>({
  userId:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
  subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
  chapterId: { type: Schema.Types.ObjectId },
  question:  { type: String, required: true },
  answer:    { type: String, required: true }
}, { timestamps: true })

const QuizQuestionSchema = new Schema<IQuizQuestion>({
  question:     { type: String, required: true },
  options:      { type: [String], required: true },
  correctIndex: { type: Number, required: true },
  explanation:  { type: String, required: true }
})

const QuizSchema = new Schema<IQuiz>({
  userId:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
  subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
  chapterId: { type: Schema.Types.ObjectId },
  questions: { type: [QuizQuestionSchema], default: [] },
  userScore: { type: Number }
}, { timestamps: true })
FlashcardSchema.index({ userId: 1, subjectId: 1, createdAt: -1 })
QuizSchema.index({ userId: 1, subjectId: 1, createdAt: -1 })
export const Flashcard = mongoose.model<IFlashcard>('Flashcard', FlashcardSchema)
export const Quiz = mongoose.model<IQuiz>('Quiz', QuizSchema)
