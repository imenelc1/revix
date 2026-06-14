import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

export function setupGuards(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()

    const publicRoutes = ['/', '/login', '/register']
    const isPublic = publicRoutes.includes(to.path)

    if (authStore.token && !authStore.user) {
      await authStore.fetchMe()
    }

    if (!authStore.isAuthenticated && !isPublic) {
      return next('/login')
    }

    // Si connecté et sur landing/login/register → dashboard
    if (authStore.isAuthenticated && (to.path === '/login' || to.path === '/register')) {
      return next('/dashboard')
    }

    next()
  })
}