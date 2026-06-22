import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/shared/utils/api'

export interface CourseDocument {
  _id: string
  subjectId: string
  fileName: string
  chaptersGenerated: number
  uploadedAt: string
}

export const useDocumentsStore = defineStore('documents', () => {
  const documents = ref<CourseDocument[]>([])
  const loading = ref(false)

  async function fetchBySubject(subjectId: string) {
    loading.value = true
    try {
      const res = await api.get(`/documents/subject/${subjectId}`)
      documents.value = res.data
    } finally {
      loading.value = false
    }
  }

  async function remove(id: string) {
    await api.delete(`/documents/${id}`)
    documents.value = documents.value.filter(d => d._id !== id)
  }

  return { documents, loading, fetchBySubject, remove }
})
