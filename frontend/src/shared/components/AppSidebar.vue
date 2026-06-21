<template>
  <aside class="w-64 shrink-0 flex flex-col h-screen sticky top-0 border-r border-surface-border dark:border-ink-700 bg-white dark:bg-ink-950 transition-colors duration-300">

    <!-- Logo -->
    <div class="px-5 py-4 border-b border-surface-border dark:border-ink-700">
      <RouterLink to="/">
        <AppLogo size="xl" />
      </RouterLink>
    </div>

    <!-- Nav -->
    <nav class="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group"
        :class="isActive(item.to)
          ? 'bg-primary/10 dark:bg-primary/15 text-primary dark:text-primary-soft border border-primary/20'
          : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-ink-800'"
      >
        <component
          :is="item.icon"
          :size="18"
          :class="isActive(item.to) ? 'text-primary dark:text-primary-soft' : 'opacity-60 group-hover:opacity-100'"
        />
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>

    <!-- User + logout -->
    <div class="px-3 py-4 border-t border-surface-border dark:border-ink-700 space-y-2">
      <div class="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-ink-800">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-soft flex items-center justify-center font-bold text-xs text-white shrink-0">
          {{ userInitials }}
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-sm font-semibold text-gray-900 dark:text-white truncate leading-none">
            {{ authStore.user?.firstName }} {{ authStore.user?.lastName }}
          </p>
          <p class="text-[11px] font-mono text-gray-400 truncate mt-0.5">{{ authStore.user?.email }}</p>
        </div>
      </div>

      <button
        @click="handleLogout"
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200"
      >
        <LogOut :size="16" />
        {{ t('auth.logout') }}
      </button>
    </div>

  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { LayoutDashboard, BookOpen, Calendar, BrainCircuit, FileText, Settings, LogOut } from '@lucide/vue'
import AppLogo from '@/shared/components/AppLogo.vue'
import { useAuthStore } from '@/stores/auth.store'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const navItems = computed(() => [
  { to: '/dashboard',  icon: LayoutDashboard, label: t('sidebar.dashboard') },
  { to: '/subjects',   icon: BookOpen,         label: t('sidebar.modules') },
  { to: '/calendar',   icon: Calendar,         label: t('sidebar.calendar') },
  { to: '/flashcards', icon: BrainCircuit,     label: 'Flashcards' },
  { to: '/pdf',        icon: FileText,         label: t('sidebar.iaAnalysis') },
  { to: '/settings',   icon: Settings,         label: t('sidebar.settings') },
])

function isActive(path: string) {
  return route.path === path
}

const userInitials = computed(() => {
  const f = authStore.user?.firstName?.charAt(0) || 'R'
  const l = authStore.user?.lastName?.charAt(0)  || 'X'
  return `${f}${l}`.toUpperCase()
})

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>
