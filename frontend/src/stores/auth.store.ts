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
  const token   = ref<string | null>(localStorage.getItem('token'))
  const loading = ref(false)
  const error   = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  function loginWithGoogle() {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    window.location.href = `${apiUrl}/auth/google`
  }

  async function register(firstName: string, lastName: string, email: string, password: string) {
    loading.value = true
    error.value   = null
    try {
      const res    = await api.post('/auth/register', { firstName, lastName, email, password })
      token.value  = res.data.token
      user.value   = res.data.user
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
    error.value   = null
    try {
      const res    = await api.post('/auth/login', { email, password })
      token.value  = res.data.token
      user.value   = res.data.user
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
      const res  = await api.get('/auth/me')
      user.value = res.data
    } catch {
      logout()
    }
  }

  // ── Mettre à jour le profil ──────────────────────────────────────────────────
  async function updateProfile(firstName: string, lastName: string) {
    const res = await api.put('/auth/me', { firstName, lastName })
    user.value = res.data
    return res.data
  }

  // ── Changer le mot de passe ──────────────────────────────────────────────────
  async function changePassword(currentPassword: string, newPassword: string) {
    return api.put('/auth/me/password', { currentPassword, newPassword })
  }

  function logout() {
    user.value  = null
    token.value = null
    localStorage.removeItem('token')
  }

  return {
    user, token, loading, error, isAuthenticated,
    setToken, loginWithGoogle,
    register, login, fetchMe, logout,
    updateProfile, changePassword,
  }
})