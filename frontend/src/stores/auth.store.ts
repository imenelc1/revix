import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/shared/utils/api'

interface User {
  id:               string
  firstName:        string
  lastName:         string
  email:            string
  createdAt?:       string
  isGoogleAccount?: boolean
}

export const useAuthStore = defineStore('auth', () => {
  const user    = ref<User | null>(null)
  const loading = ref(false)
  const error   = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  function loginWithGoogle() {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    window.location.href = `${apiUrl}/auth/google`
  }

  async function register(firstName: string, lastName: string, email: string, password: string) {
    loading.value = true
    error.value   = null
    try {
      const res  = await api.post('/auth/register', { firstName, lastName, email, password })
      user.value = res.data.user
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Erreur lors de l\'inscription'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function login(email: string, password: string) {
    loading.value = true
    error.value   = null
    try {
      const res  = await api.post('/auth/login', { email, password })
      user.value = res.data.user
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Email ou mot de passe incorrect'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchMe() {
    try {
      const res  = await api.get('/auth/me', { skipAuthRedirect: true })
      user.value = res.data
      return res.data
    } catch {
      user.value = null
      return null
    }
  }

  async function updateProfile(firstName: string, lastName: string) {
    const res = await api.put('/auth/me', { firstName, lastName })
    user.value = res.data
    return res.data
  }

  async function changePassword(currentPassword: string, newPassword: string) {
    return api.put('/auth/me/password', { currentPassword, newPassword })
  }

  async function logout() {
    user.value = null
    localStorage.removeItem('token') // nettoyage legacy
    await api.post('/auth/logout', undefined, { skipAuthRedirect: true }).catch(() => {})
  }

  return {
    user, loading, error, isAuthenticated,
    loginWithGoogle,
    register, login, fetchMe, logout,
    updateProfile, changePassword,
  }
})
