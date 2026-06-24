import { createRouter, createWebHistory } from 'vue-router'
import { setupGuards } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/',              name: 'landing',   component: () => import('../views/LandingView.vue') },
    { path: '/login',         name: 'login',     component: () => import('../views/LoginView.vue') },
    { path: '/register',      name: 'register',  component: () => import('../views/RegisterView.vue') },
    { path: '/legal',         name: 'legal',     component: () => import('../views/LegalView.vue') },
    { path: '/privacy',       name: 'privacy',   component: () => import('../views/PrivacyView.vue') },

    // ← Route de callback Google OAuth — PUBLIQUE, pas de guard
    { path: '/auth/callback', name: 'auth-callback', component: () => import('../views/AuthCallbackView.vue') },

    { path: '/onboarding',    name: 'onboarding',  component: () => import('../views/OnboardingView.vue') },
    { path: '/dashboard',     name: 'dashboard',   component: () => import('../views/DashboardView.vue') },
    { path: '/planning',      name: 'planning',    component: () => import('../views/PlanningView.vue') },
    { path: '/calendar',      name: 'calendar',    component: () => import('../views/CalendarView.vue') },
    { path: '/subjects',      name: 'subjects',    component: () => import('../views/SubjectsView.vue') },
    { path: '/flashcards',    name: 'flashcards',  component: () => import('../views/FlashcardsView.vue') },
    { path: '/pdf',           name: 'pdf',         component: () => import('../views/PdfAnalysisView.vue') },
    { path: '/settings',      name: 'settings',    component: () => import('../views/SettingsView.vue') },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue') },
    { path: '/chat', name: 'chat', component: () => import('../views/ChatView.vue') },
  ],
})

setupGuards(router)

export default router
