import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/shared/utils/api'

export interface Session {
  _id: string
  subjectId?: string
  subjectName: string
  subjectColor: string
  chapterId?: string         
  chapterTitle: string
  date: string
  startTime: string
  endTime: string
  durationMinutes: number
  status: 'planned' | 'completed' | 'missed' | 'rescheduled'
  hasBreak: boolean
  breakDurationMinutes: number
  isManual?: boolean         
}

export interface Planning {
  _id: string
  sessions: Session[]
  overallReadinessScore: number
  generatedAt: string
}

export const usePlanningStore = defineStore('planning', () => {
  const planning = ref<Planning | null>(null)
  const weekSessions = ref<Session[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function generate(availableDays: number[], hoursPerDay: number, startHour: number) {
    loading.value = true
    error.value = null
    try {
      const res = await api.post('/planning/generate', { availableDays, hoursPerDay, startHour })
      planning.value = res.data
      return res.data
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Erreur génération planning'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetch() {
    loading.value = true
    try {
      const res = await api.get('/planning')
      planning.value = res.data
    } catch {
      planning.value = null
    } finally {
      loading.value = false
    }
  }

  async function fetchWeek(weekStart: string) {
    const res = await api.get(`/planning/week?weekStart=${weekStart}`)
    weekSessions.value = res.data
    return res.data
  }

  async function updateStatus(sessionId: string, status: 'completed' | 'missed') {
    await api.patch(`/planning/sessions/${sessionId}/status`, { status })
    if (planning.value) {
      const session = planning.value.sessions.find(s => s._id === sessionId)
      if (session) session.status = status
    }
    weekSessions.value = weekSessions.value.map(s =>
      s._id === sessionId ? { ...s, status } : s
    )
  }

  async function reschedule() {
    const res = await api.post('/planning/reschedule')
    planning.value = res.data
    return res.data
  }
async function addSession(data: {
    subjectId?: string | null
    chapterId?: string
    customTitle?: string
    date: string
    startTime: string
    durationMinutes: number
  }) {
    const res = await api.post('/planning/sessions', data)
    planning.value = res.data
    return res.data
  }

  async function updateSession(sessionId: string, data: {
    subjectId?: string | null
    chapterId?: string
    customTitle?: string
    date?: string
    startTime?: string
    durationMinutes?: number
  }) {
    const res = await api.put(`/planning/sessions/${sessionId}`, data)
    planning.value = res.data
    return res.data
  }

  async function deleteSession(sessionId: string) {
    const res = await api.delete(`/planning/sessions/${sessionId}`)
    planning.value = res.data
    return res.data
  }
  return { planning, weekSessions, loading, error, generate, fetch, fetchWeek, updateStatus, reschedule, addSession, updateSession, deleteSession }
})
