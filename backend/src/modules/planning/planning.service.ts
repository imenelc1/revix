import { Planning } from './planning.model'
import { Subject } from '../subject/subject.model'
import { generateSessions } from './planning.algorithm'

interface GenerateInput {
  availableDays: number[]
  hoursPerDay: number
  startHour: number
}

export const planningService = {

  // Générer un nouveau planning
  async generate(userId: string, input: GenerateInput) {
    // Récupérer tous les modules de l'étudiant
    const subjects = await Subject.find({ userId })
    if (subjects.length === 0) throw new Error('Aucun module trouvé. Ajoutez des modules d\'abord.')

    const totalChapters = subjects.reduce((sum, s) => sum + s.chapters.length, 0)
    if (totalChapters === 0) throw new Error('Aucun chapitre trouvé. Ajoutez des chapitres à vos modules.')

    // Générer les sessions via l'algorithme
    const sessions = generateSessions(subjects, input)
    if (sessions.length === 0) throw new Error('Impossible de générer un planning. Vérifiez vos disponibilités.')

    // Calculer le score global de préparation
    const coveredChapters = sessions.map(s => s.chapterId.toString())
    const uniqueCovered = new Set(coveredChapters).size
    const overallReadinessScore = Math.round((uniqueCovered / totalChapters) * 100)

    // Supprimer l'ancien planning et créer le nouveau
    await Planning.deleteOne({ userId })
    const planning = await Planning.create({
      userId,
      sessions,
      overallReadinessScore,
      generatedAt: new Date()
    })

    return planning
  },

  // Récupérer le planning actuel
  async get(userId: string) {
    const planning = await Planning.findOne({ userId })
    if (!planning) throw new Error('Aucun planning généré')
    return planning
  },

  // Récupérer les sessions d'une semaine précise
  async getWeek(userId: string, weekStart: string) {
    const planning = await Planning.findOne({ userId })
    if (!planning) throw new Error('Aucun planning généré')

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
    if (!planning) throw new Error('Aucun planning trouvé')

    const session = planning.sessions.find(s => s._id?.toString() === sessionId)
    if (!session) throw new Error('Session introuvable')

    session.status = status
    await planning.save()
    return planning
  },

  // Rattrapage — redistribuer les sessions ratées
  async reschedule(userId: string) {
    const planning = await Planning.findOne({ userId })
    if (!planning) throw new Error('Aucun planning trouvé')

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Trouver les sessions ratées
    const missedSessions = planning.sessions.filter(s => s.status === 'missed')
    if (missedSessions.length === 0) return { message: 'Aucune session ratée à rattraper' }

    // Trouver les prochains jours avec de la place (sessions planned à venir)
    const futurePlanned = planning.sessions
      .filter(s => s.status === 'planned' && new Date(s.date) > today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Redistribuer chaque session ratée sur le prochain jour dispo
    for (let i = 0; i < missedSessions.length; i++) {
      const missed = missedSessions[i]
      const targetDay = futurePlanned[i % futurePlanned.length]
      if (!targetDay) continue

      // Créer une nouvelle session le lendemain du jour cible
      const newDate = new Date(targetDay.date)
      newDate.setDate(newDate.getDate() + 1)

      missed.date = newDate
      missed.status = 'rescheduled'
    }

    await planning.save()
    return planning
  }
}
