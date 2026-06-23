import { ISubject } from '../subject/subject.model'
import { ISession } from './planning.model'
import { computePriorityScore, recommendedDuration } from '../../utils/priority.score'
import mongoose from 'mongoose'

export interface Availability {
  availableDays: number[]
  hoursPerDay: number
  startHour: number
}

interface ChapterWithMeta {
  subjectId: mongoose.Types.ObjectId
  subjectName: string
  subjectColor: string
  chapterId: mongoose.Types.ObjectId
  chapterTitle: string
  priorityScore: number
  durationMinutes: number
  examDate: Date
}

// Formate une heure en string "HH:MM"
export function formatTime(hour: number, minute: number): string {
  return `${String(Math.floor(hour)).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

// Ajoute des minutes à une heure "HH:MM" et retourne "HH:MM"
export function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number)
  const total = h * 60 + m + minutes
  return formatTime(Math.floor(total / 60), total % 60)
}

// Génère toutes les dates disponibles entre aujourd'hui et la dernière date d'examen
function getAvailableDates(subjects: ISubject[], availability: Availability): Date[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const lastExam = subjects.reduce((max, s) => {
    const d = new Date(s.examDate)
    return d > max ? d : max
  }, today)

  const dates: Date[] = []
  const current = new Date(today)

  while (current <= lastExam) {
    if (availability.availableDays.includes(current.getDay())) {
      dates.push(new Date(current))
    }
    current.setDate(current.getDate() + 1)
  }

  return dates
}

export function generateSessions(subjects: ISubject[], availability: Availability): ISession[] {
  // 1. Construire la liste de tous les chapitres avec leur score de priorité
  const chapters: ChapterWithMeta[] = []

  for (const subject of subjects) {
    for (const chapter of subject.chapters) {
      if (chapter.covered) continue // ignorer les chapitres déjà couverts
      chapters.push({
        subjectId:    subject._id as mongoose.Types.ObjectId,
        subjectName:  subject.name,
        subjectColor: subject.color,
        chapterId:    chapter._id as mongoose.Types.ObjectId,
        chapterTitle: chapter.title,
        priorityScore:computePriorityScore(chapter, subject.examDate),
        durationMinutes: recommendedDuration(chapter),
        examDate:     subject.examDate
      })
    }
  }

  // 2. Trier par score décroissant (plus prioritaire en premier)
  chapters.sort((a, b) => b.priorityScore - a.priorityScore)

  // 3. Récupérer les dates disponibles
  const dates = getAvailableDates(subjects, availability)
  const maxMinutesPerDay = availability.hoursPerDay * 60

  // 4. Distribuer les chapitres sur les jours disponibles
  const sessions: ISession[] = []
  let chapterIndex = 0

  for (const date of dates) {
    if (chapterIndex >= chapters.length) break

    let minutesUsed = 0
    let currentTime = formatTime(availability.startHour, 0)

    while (minutesUsed < maxMinutesPerDay && chapterIndex < chapters.length) {
      const chapter = chapters[chapterIndex]

      // Vérifier que l'examen n'est pas dépassé
      if (date >= chapter.examDate) { chapterIndex++; continue }

      const duration = Math.min(chapter.durationMinutes, maxMinutesPerDay - minutesUsed)
      if (duration < 30) break // pas assez de temps pour une session utile

      const startTime = currentTime
      const endTime = addMinutes(startTime, duration)

      // Ajouter une pause de 15 min si la session dure plus de 90 min
      const hasBreak = duration >= 90
      const breakDuration = hasBreak ? 15 : 0

      sessions.push({
        subjectId:           chapter.subjectId,
        subjectName:         chapter.subjectName,
        subjectColor:        chapter.subjectColor,
        chapterId:           chapter.chapterId,
        chapterTitle:        chapter.chapterTitle,
        date:                new Date(date),
        startTime,
        endTime,
        durationMinutes:     duration,
        status:              'planned',
        hasBreak,
        breakDurationMinutes:breakDuration
      })

      minutesUsed += duration + breakDuration
      currentTime = addMinutes(endTime, breakDuration)
      chapterIndex++
    }
  }

  return sessions
}
function dateKey(d: Date): string {
  const dt = new Date(d)
  dt.setHours(0, 0, 0, 0)
  return dt.toISOString().slice(0, 10)
}

// Replace les sessions 'missed' sur les prochains jours disponibles,
// en respectant le budget horaire quotidien et sans chevaucher les sessions déjà placées ce jour-là.
export function rescheduleMissedSessions(
  sessions: ISession[],
  availability: Availability
): { rescheduledCount: number; unresolvedCount: number } {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const missed = sessions.filter(s => s.status === 'missed')
  if (missed.length === 0) return { rescheduledCount: 0, unresolvedCount: 0 }

  const maxMinutesPerDay = availability.hoursPerDay * 60

  const usedMinutesByDay = new Map<string, number>()
  const lastEndTimeByDay = new Map<string, string>()

  for (const s of sessions) {
    if (s.status === 'missed') continue
    const key = dateKey(s.date)
    const totalDuration = s.durationMinutes + s.breakDurationMinutes
    usedMinutesByDay.set(key, (usedMinutesByDay.get(key) || 0) + totalDuration)

    const candidateEnd = addMinutes(s.endTime, s.breakDurationMinutes)
    const currentLast = lastEndTimeByDay.get(key)
    if (!currentLast || candidateEnd > currentLast) {
      lastEndTimeByDay.set(key, candidateEnd)
    }
  }

  let rescheduledCount = 0
  const MAX_LOOKAHEAD_DAYS = 90

  for (const session of missed) {
    let placed = false

    for (let offset = 1; offset <= MAX_LOOKAHEAD_DAYS && !placed; offset++) {
      const candidateDate = new Date(today)
      candidateDate.setDate(candidateDate.getDate() + offset)

      if (!availability.availableDays.includes(candidateDate.getDay())) continue

      const key = dateKey(candidateDate)
      const usedMinutes = usedMinutesByDay.get(key) || 0
      const remaining = maxMinutesPerDay - usedMinutes
      if (remaining < session.durationMinutes) continue

      const startTime = lastEndTimeByDay.get(key) || formatTime(availability.startHour, 0)
      const endTime = addMinutes(startTime, session.durationMinutes)

      session.date = candidateDate
      session.startTime = startTime
      session.endTime = endTime
      session.status = 'rescheduled'

      const totalUsed = session.durationMinutes + session.breakDurationMinutes
      usedMinutesByDay.set(key, usedMinutes + totalUsed)
      lastEndTimeByDay.set(key, addMinutes(endTime, session.breakDurationMinutes))

      rescheduledCount++
      placed = true
    }
  }

  const unresolvedCount = missed.filter(s => s.status === 'missed').length
  return { rescheduledCount, unresolvedCount }
}
