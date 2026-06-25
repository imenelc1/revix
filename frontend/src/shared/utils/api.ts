import axios from 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuthRedirect?: boolean
  }
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:3000/api'),
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})

api.interceptors.request.use((config) => {
  config.headers['X-Locale'] = localStorage.getItem('locale') || 'fr'
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.skipAuthRedirect) {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
