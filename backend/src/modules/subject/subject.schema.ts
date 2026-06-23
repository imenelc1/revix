import { z } from 'zod'

export const CreateSubjectSchema = z.object({
  name:     z.string().min(1, 'subject.nameRequired'),
  color:    z.string().optional(),
  examDate: z.string().refine(d => !isNaN(Date.parse(d)), { message: 'subject.invalidDate' })
})

export const UpdateSubjectSchema = CreateSubjectSchema.partial()

export const ChapterSchema = z.object({
  title:          z.string().min(1, 'subject.titleRequired'),
  masteryLevel:   z.enum(['not_understood', 'average', 'mastered']).default('average'),
  difficulty:     z.enum(['low', 'medium', 'high']).default('medium'),
  importanceScore:z.number().min(1).max(5).default(3)
})

export const UpdateChapterSchema = ChapterSchema.partial()

export type CreateSubjectInput = z.infer<typeof CreateSubjectSchema>
export type ChapterInput = z.infer<typeof ChapterSchema>
