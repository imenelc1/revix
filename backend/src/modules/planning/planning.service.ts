import { Planning } from './planning.model'
import { Subject } from '../subject/subject.model'
import { generateSessions, rescheduleMissedSessions, addMinutes } from './planning.algorithm'
interface GenerateInput {
  availableDays: number[]
  hoursPerDay: number
  startHour: number
}

export function countUniqueCoveredChapters(sessions: { chapterId?: { toString(): string } }[]) {
  const coveredChapters = sessions
    .map(s => s.chapterId?.toString())
    .filter((chapterId): chapterId is string => Boolean(chapterId))

  return new Set(coveredChapters).size
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

  const uniqueCovered = countUniqueCoveredChapters(sessions)
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

    return sessions.sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime() ||
      a.startTime.localeCompare(b.startTime)
    )
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
},
// ── Ajouter une séance manuelle ───────────────────────────────────────────────
  async addSession(userId: string, input: {
    subjectId?: string | null
    chapterId?: string
    customTitle?: string
    date: string
    startTime: string
    durationMinutes: number
  }) {
    let chapterId: any
    let chapterTitle = input.customTitle?.trim() || ''
    let subjectId: any
    let subjectName = 'Personnel'
    let subjectColor = '#6366f1'

    if (input.subjectId) {
      const subject = await Subject.findOne({ _id: input.subjectId, userId })
      if (!subject) throw new Error('subject.notFound')

      subjectId = subject._id
      subjectName = subject.name
      subjectColor = subject.color

      if (input.chapterId) {
        const chapter = subject.chapters.find(c => c._id?.toString() === input.chapterId)
        if (!chapter) throw new Error('chapter.notFound')
        chapterId = chapter._id
        chapterTitle = chapter.title
      }
    }

    if (!chapterTitle) throw new Error('planning.sessionTitleRequired')

    const startTime = input.startTime
    const endTime = addMinutes(startTime, input.durationMinutes)

    const newSession: any = {
      subjectId,
      subjectName,
      subjectColor,
      chapterId,
      chapterTitle,
      date: new Date(input.date),
      startTime,
      endTime,
      durationMinutes: input.durationMinutes,
      status: 'planned',
      hasBreak: false,
      breakDurationMinutes: 0,
      isManual: true
    }

    let planning = await Planning.findOne({ userId })
    if (!planning) {
      planning = await Planning.create({
        userId,
        sessions: [newSession],
        overallReadinessScore: 0,
        generatedAt: new Date(),
        availability: { availableDays: [1, 2, 3, 4, 5], hoursPerDay: 4, startHour: 9 }
      })
    } else {
      planning.sessions.push(newSession)
      await planning.save()
    }

    return planning
  },

  // ── Modifier une séance existante (manuelle ou générée) ───────────────────────
  async updateSession(userId: string, sessionId: string, input: {
    subjectId?: string | null
    chapterId?: string
    customTitle?: string
    date?: string
    startTime?: string
    durationMinutes?: number
  }) {
    const planning = await Planning.findOne({ userId })
    if (!planning) throw new Error('planning.noneFound')

    const session = planning.sessions.find(s => s._id?.toString() === sessionId)
    if (!session) throw new Error('planning.sessionNotFound')

    if (input.subjectId === null || input.subjectId === '') {
      session.subjectId = undefined
      session.subjectName = 'Personnel'
      session.subjectColor = '#6366f1'
      session.chapterId = undefined
      if (input.customTitle !== undefined) {
        session.chapterTitle = input.customTitle.trim() || session.chapterTitle
      }
    } else if (input.subjectId) {
      const subject = await Subject.findOne({ _id: input.subjectId, userId })
      if (!subject) throw new Error('subject.notFound')

      session.subjectId = subject._id as any
      session.subjectName = subject.name
      session.subjectColor = subject.color

      if (input.chapterId) {
        const chapter = subject.chapters.find(c => c._id?.toString() === input.chapterId)
        if (!chapter) throw new Error('chapter.notFound')
        session.chapterId = chapter._id as any
        session.chapterTitle = chapter.title
      } else if (input.customTitle !== undefined) {
        session.chapterId = undefined
        session.chapterTitle = input.customTitle.trim() || session.chapterTitle
      }
    } else if (input.chapterId) {
      if (!session.subjectId) throw new Error('subject.notFound')
      const subject = await Subject.findOne({ _id: session.subjectId, userId })
      if (!subject) throw new Error('subject.notFound')
      const chapter = subject.chapters.find(c => c._id?.toString() === input.chapterId)
      if (!chapter) throw new Error('chapter.notFound')
      session.chapterId = chapter._id as any
      session.chapterTitle = chapter.title
    } else if (input.customTitle !== undefined) {
      session.chapterId = undefined
      if (!session.subjectId) {
        session.subjectName = 'Personnel'
        session.subjectColor = '#6366f1'
      }
      session.chapterTitle = input.customTitle.trim() || session.chapterTitle
    }

    if (input.date) session.date = new Date(input.date)
    if (input.startTime) session.startTime = input.startTime
    if (input.durationMinutes) session.durationMinutes = input.durationMinutes
    if (input.startTime || input.durationMinutes) {
      session.endTime = addMinutes(session.startTime, session.durationMinutes)
    }

    await planning.save()
    return planning
  },

  // ── Supprimer une séance ──────────────────────────────────────────────────────
  async deleteSession(userId: string, sessionId: string) {
    const planning = await Planning.findOne({ userId })
    if (!planning) throw new Error('planning.noneFound')

    const exists = planning.sessions.some(s => s._id?.toString() === sessionId)
    if (!exists) throw new Error('planning.sessionNotFound')

    planning.sessions = planning.sessions.filter(s => s._id?.toString() !== sessionId) as any
    await planning.save()
    return planning
  }
}
