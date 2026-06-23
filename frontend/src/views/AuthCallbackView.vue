<template>
  <div class="min-h-screen flex items-center justify-center bg-white dark:bg-ink-950">
    <div class="text-center space-y-4">
      <AppSpinner size="lg" />
      <p class="text-sm text-gray-500 dark:text-gray-400 font-mono">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth.store'
import AppSpinner from '@/shared/components/AppSpinner.vue'

const router    = useRouter()
const authStore = useAuthStore()
const { t }     = useI18n()
const message   = ref(t('auth.connecting'))

onMounted(async () => {
  const params = new URLSearchParams(window.location.search)
  const token  = params.get('token')
  const error  = params.get('error')

  if (error || !token) {
    message.value = t('auth.googleFailed')
    setTimeout(() => router.push('/login?error=google_failed'), 2000)
    return
  }

  authStore.setToken(token)
  await authStore.fetchMe()

  if (authStore.user) {
    router.push('/dashboard')
  } else {
    message.value = t('auth.profileError')
    setTimeout(() => router.push('/login'), 2000)
  }
})
</script>