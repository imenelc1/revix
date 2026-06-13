import { createRouter, createWebHistory } from 'vue-router'
import { setupGuards } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
    { path: '/register', name: 'register', component: () => import('../views/RegisterView.vue') },
    { path: '/onboarding', name: 'onboarding', component: () => import('../views/OnboardingView.vue') },
    { path: '/dashboard', name: 'dashboard', component: () => import('../views/DashboardView.vue') },
    { path: '/planning', name: 'planning', component: () => import('../views/PlanningView.vue') },
    { path: '/calendar', name: 'calendar', component: () => import('../views/CalendarView.vue') },
    { path: '/subjects', name: 'subjects', component: () => import('../views/SubjectsView.vue') },
    { path: '/flashcards', name: 'flashcards', component: () => import('../views/FlashcardsView.vue') },
    { path: '/pdf', name: 'pdf', component: () => import('../views/PdfAnalysisView.vue') },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue') }
  ]
})

setupGuards(router)

export default router
