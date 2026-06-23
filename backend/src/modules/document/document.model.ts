import mongoose, { Document, Schema } from 'mongoose'

export interface ICourseDocument extends Document {
  userId: mongoose.Types.ObjectId
  subjectId: mongoose.Types.ObjectId
  fileName: string
  chaptersGenerated: number
  extractedText: string
  uploadedAt: Date
}
const CourseDocumentSchema = new Schema<ICourseDocument>({
  userId:            { type: Schema.Types.ObjectId, ref: 'User', required: true },
  subjectId:         { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
  fileName:          { type: String, required: true },
  chaptersGenerated: { type: Number, default: 0 },
  extractedText:     { type: String, default: '' },
  uploadedAt:        { type: Date, default: Date.now }
})
CourseDocumentSchema.index({ userId: 1, subjectId: 1, uploadedAt: -1 })
export const CourseDocument = mongoose.model<ICourseDocument>('CourseDocument', CourseDocumentSchema)
