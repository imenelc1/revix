import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/shared/utils/api'

export interface ChatMessage {
  _id: string
  subjectId: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

export const useChatStore = defineStore('chat', () => {
  const messages = ref<ChatMessage[]>([])
  const loading = ref(false)
  const sending = ref(false)
  const error = ref<string | null>(null)

  async function fetchHistory(subjectId: string) {
    loading.value = true
    error.value = null
    try {
      const res = await api.get(`/chat/${subjectId}/history`)
      messages.value = res.data
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Erreur'
    } finally {
      loading.value = false
    }
  }

  async function ask(subjectId: string, question: string) {
    sending.value = true
    error.value = null
    messages.value.push({
      _id: 'temp-' + Date.now(),
      subjectId,
      role: 'user',
      content: question,
      createdAt: new Date().toISOString()
    })
    try {
      const res = await api.post(`/chat/${subjectId}/ask`, { question })
      messages.value.push(res.data)
      return res.data
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Erreur lors de la demande'
      messages.value.pop()
      throw err
    } finally {
      sending.value = false
    }
  }

  async function clearHistory(subjectId: string) {
    await api.delete(`/chat/${subjectId}/history`)
    messages.value = []
  }

  function reset() {
    messages.value = []
    error.value = null
  }

  return { messages, loading, sending, error, fetchHistory, ask, clearHistory, reset }
})