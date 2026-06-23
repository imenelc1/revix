import mongoose, { Document, Schema } from 'mongoose'

export type SessionStatus = 'planned' | 'completed' | 'missed' | 'rescheduled'

export interface ISession {
  _id?: mongoose.Types.ObjectId
  subjectId: mongoose.Types.ObjectId
  subjectName: string
  subjectColor: string
  chapterId: mongoose.Types.ObjectId
  chapterTitle: string
  date: Date
  startTime: string
  endTime: string
  durationMinutes: number
  status: SessionStatus
  hasBreak: boolean
  breakDurationMinutes: number
}

export interface IPlanning extends Document {
  userId: mongoose.Types.ObjectId
  sessions: ISession[]
  overallReadinessScore: number
  generatedAt: Date
  availability: {
    availableDays: number[]
    hoursPerDay: number
    startHour: number
  }
  createdAt: Date
  updatedAt: Date
}

const SessionSchema = new Schema<ISession>({
  subjectId:           { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
  subjectName:         { type: String, required: true },
  subjectColor:        { type: String, default: '#6366f1' },
  chapterId:           { type: Schema.Types.ObjectId, required: true },
  chapterTitle:        { type: String, required: true },
  date:                { type: Date, required: true },
  startTime:           { type: String, required: true },
  endTime:             { type: String, required: true },
  durationMinutes:     { type: Number, required: true },
  status:              { type: String, enum: ['planned', 'completed', 'missed', 'rescheduled'], default: 'planned' },
  hasBreak:            { type: Boolean, default: false },
  breakDurationMinutes:{ type: Number, default: 0 }
})

const AvailabilitySchema = new Schema({
  availableDays: { type: [Number], default: [] },
  hoursPerDay:   { type: Number, default: 4 },
  startHour:     { type: Number, default: 9 }
}, { _id: false })

const PlanningSchema = new Schema<IPlanning>({
  userId:               { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sessions:             { type: [SessionSchema], default: [] },
  overallReadinessScore:{ type: Number, default: 0 },
  generatedAt:          { type: Date, default: Date.now },
  availability:         { type: AvailabilitySchema, default: () => ({ availableDays: [], hoursPerDay: 4, startHour: 9 }) }
}, { timestamps: true })

export const Planning = mongoose.model<IPlanning>('Planning', PlanningSchema)
