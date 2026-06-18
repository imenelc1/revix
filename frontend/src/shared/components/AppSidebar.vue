<template>
  <aside class="w-64 border-r border-gray-200 dark:border-ink-700 bg-white dark:bg-ink-950 p-4 flex flex-col justify-between shrink-0 transition-colors duration-300">
   <div class="space-y-8">
      <div class="px-3">
        <h2 class="font-display text-xl font-bold tracking-tight text-gray-900 dark:text-white">Revix</h2>
        <p class="text-[10px] font-mono tracking-widest text-gray-400 dark:text-gray-500 uppercase font-semibold mt-0.5">
          {{ t('sidebar.academicExcellence') }}
        </p>
      </div>

      <nav class="space-y-1">
        <a href="#" class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-ink-800/50 transition duration-200">
          <LayoutDashboard :size="18" class="opacity-80" />
          {{ t('sidebar.dashboard') }}
        </a>
        
        <a href="#" class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-primary-soft dark:text-white bg-gray-50 dark:bg-ink-800 border border-gray-100 dark:border-ink-700/50 shadow-inner transition duration-200">
          <BookOpen :size="18" />
          {{ t('sidebar.modules') }}
        </a>
        
        <a href="#" class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-ink-800/50 transition duration-200">
          <Calendar :size="18" class="opacity-80" />
          {{ t('sidebar.calendar') }}
        </a>
        
        <a href="#" class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-ink-800/50 transition duration-200">
          <BarChart3 :size="18" class="opacity-80" />
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