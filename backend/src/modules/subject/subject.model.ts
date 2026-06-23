import mongoose, { Document, Schema } from 'mongoose'

export type MasteryLevel = 'not_understood' | 'average' | 'mastered'
export type DifficultyLevel = 'low' | 'medium' | 'high'

export interface IChapter {
  _id?: mongoose.Types.ObjectId
  title: string
  masteryLevel: MasteryLevel
  difficulty: DifficultyLevel
  importanceScore: number
  covered: boolean
}

export interface ISubject extends Document {
  userId: mongoose.Types.ObjectId
  name: string
  color: string
  examDate: Date
  examModeActive: boolean
  chapters: IChapter[]
  createdAt: Date
  updatedAt: Date
}

const ChapterSchema = new Schema<IChapter>({
  title:          { type: String, required: true, trim: true },
  masteryLevel:   { type: String, enum: ['not_understood', 'average', 'mastered'], default: 'average' },
  difficulty:     { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  importanceScore:{ type: Number, min: 1, max: 5, default: 3 },
  covered:        { type: Boolean, default: false }
})

const SubjectSchema = new Schema<ISubject>({
  userId:          { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name:            { type: String, required: true, trim: true },
  color:           { type: String, default: '#6366f1' },
  examDate:        { type: Date, required: true },
  examModeActive:  { type: Boolean, default: false },
  chapters:        { type: [ChapterSchema], default: [] }
}, { timestamps: true })
SubjectSchema.index({ userId: 1, examDate: 1 })
export const Subject = mongoose.model<ISubject>('Subject', SubjectSchema)