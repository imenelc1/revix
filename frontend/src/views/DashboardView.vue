<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-6">
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold">Dashboard</h1>
        <AppButton variant="outline" size="sm" @click="onLogout">
          <template #icon-left><LogOut :size="16" /></template>
          Déconnexion
        </AppButton>
      </div>

      <p class="text-gray-600 dark:text-gray-400">DashboardView</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { LogOut } from '@lucide/vue'
import AppButton from '@/shared/components/AppButton.vue'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

function onLogout() {
  authStore.logout()
  router.push('/login')
}
</script>
