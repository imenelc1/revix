import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

export function setupGuards(router: Router) {
  router.beforeEach(async (to, _from, next) => {
    const authStore = useAuthStore()

    const publicRoutes = ['/', '/login', '/register', '/auth/callback', '/legal', '/privacy', '/forgot-password', '/reset-password']
    const isPublic     = publicRoutes.includes(to.path)

    if (!authStore.user) {
      await authStore.fetchMe()
    }

    if (!authStore.isAuthenticated && !isPublic) {
      return next('/login')
    }

    if (authStore.isAuthenticated && (to.path === '/login' || to.path === '/register')) {
      return next('/dashboard')
    }

    next()
  })
}
