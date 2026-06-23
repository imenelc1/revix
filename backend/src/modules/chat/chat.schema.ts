import { z } from 'zod'

export const AskSchema = z.object({
  question: z.string().min(1, 'chat.questionRequired').max(2000, 'chat.questionTooLong')
})

export type AskInput = z.infer<typeof AskSchema>