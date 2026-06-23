import { Planning } from './planning.model'
import { Subject } from '../subject/subject.model'
import { generateSessions, rescheduleMissedSessions } from './planning.algorithm'

interface GenerateInput {
  availableDays: number[]
  hoursPerDay: number
  startHour: number
}

export const planningService = {

  // Générer un nouveau planning
  async generate(userId: string, input: GenerateInput) {
  const subjects = await Subject.find({ userId })
  if (subjects.length === 0) throw new Error('planning.noSubjectsFound')

  const totalChapters = subjects.reduce((sum, s) => sum + s.chapters.length, 0)
  if (totalChapters === 0) throw new Error('planning.noChaptersFound')

  const sessions = generateSessions(subjects, input)
  if (sessions.length === 0) throw new Error('planning.cannotGenerate')

  const coveredChapters = sessions.map(s => s.chapterId.toString())
  const uniqueCovered = new Set(coveredChapters).size
  const overallReadinessScore = Math.round((uniqueCovered / totalChapters) * 100)

  await Planning.deleteOne({ userId })
  const planning = await Planning.create({
    userId,
    sessions,
    overallReadinessScore,
    generatedAt: new Date(),
    availability: {
      availableDays: input.availableDays,
      hoursPerDay: input.hoursPerDay,
      startHour: input.startHour
    }
  })

  return planning
},

  // Récupérer le planning actuel
  async get(userId: string) {
    const planning = await Planning.findOne({ userId })
    if (!planning) throw new Error('planning.notFound')
    return planning
  },

  // Récupérer les sessions d'une semaine précise
  async getWeek(userId: string, weekStart: string) {
    const planning = await Planning.findOne({ userId })
    if (!planning) throw new Error('planning.notFound')

    const start = new Date(weekStart)
    const end = new Date(start)
    end.setDate(end.getDate() + 7)

    const sessions = planning.sessions.filter(s => {
      const d = new Date(s.date)
      return d >= start && d < end
    })

    return sessions
  },

  // Marquer une session comme complétée ou ratée
  async updateSessionStatus(userId: string, sessionId: string, status: 'completed' | 'missed') {
    const planning = await Planning.findOne({ userId })
    if (!planning) throw new Error('planning.notFound')

    const session = planning.sessions.find(s => s._id?.toString() === sessionId)
    if (!session) throw new Error('planning.sessionNotFound')

    session.status = status
    await planning.save()
    return planning
  },

  // Rattrapage — redistribuer les sessions ratées
 async reschedule(userId: string) {
  const planning = await Planning.findOne({ userId })
  if (!planning) throw new Error('planning.noneFound')

  const hasMissed = planning.sessions.some(s => s.status === 'missed')
  if (!hasMissed) return { message: 'planning.noMissedToReschedule' }

  // Fallback pour les plannings générés avant l'ajout du champ availability
  const availability = planning.availability?.availableDays?.length
    ? planning.availability
    : { availableDays: [1, 2, 3, 4, 5], hoursPerDay: 4, startHour: 9 }

  rescheduleMissedSessions(planning.sessions, availability)
  await planning.save()

  return planning
}
}
