import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

export function setupGuards(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()

    const publicRoutes = ['/login', '/register']
    const isPublic = publicRoutes.includes(to.path)

    // Si token en localStorage mais pas d'user en store → fetchMe
    if (authStore.token && !authStore.user) {
      await authStore.fetchMe()
    }

    if (!authStore.isAuthenticated && !isPublic) {
      return next('/login')
    }

    if (authStore.isAuthenticated && isPublic) {
      return next('/dashboard')
    }

    next()
  })
}
