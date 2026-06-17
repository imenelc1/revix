<template>
  <aside class="w-64 border-r border-gray-200 dark:border-ink-700 bg-white dark:bg-ink-950 p-4 flex flex-col justify-between shrink-0 transition-colors duration-300">
    <div class="space-y-6">
      <div class="px-3">
        <h2 class="font-display text-lg font-bold tracking-tight text-gray-900 dark:text-white">Revix</h2>
        <p class="text-[11px] font-mono tracking-wider text-gray-400 dark:text-gray-500 uppercase">
          {{ t('sidebar.academicExcellence') }}
        </p>
      </div>

      <nav class="space-y-1">
        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-ink-800 transition">
          <LayoutDashboard :size="18" />
          {{ t('sidebar.dashboard') }}
        </a>
        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-primary-soft dark:text-white bg-primary/5 dark:bg-ink-800 border border-primary/10 dark:border-ink-600 transition">
          <BookOpen :size="18" />
          {{ t('sidebar.modules') }}
        </a>
        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-ink-800 transition">
          <Calendar :size="18" />
          {{ t('sidebar.calendar') }}
        </a>
        <a href="#" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-ink-800 transition">
          <BarChart3 :size="18" />
          {{ t('sidebar.iaAnalysis') }}
        </a>
      </nav>
    </div>

    <div class="pt-4 border-t border-gray-200 dark:border-ink-700">
      <AppButton 
        full-width 
        variant="danger" 
        size="md" 
        class="gap-2"
        @click="handleLogout"
      >
        <LogOut :size="16" />
        {{ t('auth.logout') }}
      </AppButton>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { LayoutDashboard, BookOpen, Calendar, BarChart3, LogOut } from '@lucide/vue'
import AppButton from '@/shared/components/AppButton.vue'
import { useAuthStore } from '@/stores/auth.store'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

async function handleLogout() {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (err) {
    console.error('Logout error', err)
  }
}
</script>