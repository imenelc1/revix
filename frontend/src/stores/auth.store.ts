import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/shared/utils/api'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  async function register(firstName: string, lastName: string, email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const res = await api.post('/auth/register', { firstName, lastName, email, password })
      token.value = res.data.token
      user.value = res.data.user
      localStorage.setItem('token', res.data.token)
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Erreur lors de l\'inscription'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function login(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const res = await api.post('/auth/login', { email, password })
      token.value = res.data.token
      user.value = res.data.user
      localStorage.setItem('token', res.data.token)
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Email ou mot de passe incorrect'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchMe() {
    if (!token.value) return
    try {
      const res = await api.get('/auth/me')
      user.value = res.data
    } catch {
      logout()
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  return { user, token, loading, error, isAuthenticated, register, login, fetchMe, logout }
})
