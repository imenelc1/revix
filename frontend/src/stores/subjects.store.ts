import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/shared/utils/api'

export interface Chapter {
  _id: string
  title: string
  masteryLevel: 'not_understood' | 'average' | 'mastered'
  difficulty: 'low' | 'medium' | 'high'
  importanceScore: number
  covered: boolean
}

export interface Subject {
  _id: string
  name: string
  color: string
  examDate: string
  examModeActive: boolean
  chapters: Chapter[]
}

export const useSubjectsStore = defineStore('subjects', () => {
  const subjects = ref<Subject[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    try {
      const res = await api.get('/subjects')
      subjects.value = res.data
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Erreur'
    } finally {
      loading.value = false
    }
  }

  async function create(data: { name: string; color: string; examDate: string }) {
    const res = await api.post('/subjects', data)
    subjects.value.push(res.data)
    return res.data
  }

  async function remove(id: string) {
    await api.delete(`/subjects/${id}`)
    subjects.value = subjects.value.filter(s => s._id !== id)
  }

  async function addChapter(subjectId: string, chapter: Omit<Chapter, '_id' | 'covered'>) {
    const res = await api.post(`/subjects/${subjectId}/chapters`, chapter)
    const index = subjects.value.findIndex(s => s._id === subjectId)
    if (index !== -1) subjects.value[index] = res.data
    return res.data
  }

  async function updateChapter(subjectId: string, chapterId: string, data: Partial<Chapter>) {
    const res = await api.put(`/subjects/${subjectId}/chapters/${chapterId}`, data)
    const index = subjects.value.findIndex(s => s._id === subjectId)
    if (index !== -1) subjects.value[index] = res.data
    return res.data
  }

  async function removeChapter(subjectId: string, chapterId: string) {
    const res = await api.delete(`/subjects/${subjectId}/chapters/${chapterId}`)
    const index = subjects.value.findIndex(s => s._id === subjectId)
    if (index !== -1) subjects.value[index] = res.data
  }

  return { subjects, loading, error, fetchAll, create, remove, addChapter, updateChapter, removeChapter }
})
