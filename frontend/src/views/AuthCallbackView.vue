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
import api from '@/shared/utils/api'
import AppSpinner from '@/shared/components/AppSpinner.vue'

const router    = useRouter()
const authStore = useAuthStore()
const { t }     = useI18n()
const message   = ref(t('auth.connecting'))

onMounted(async () => {
  const params = new URLSearchParams(window.location.search)
  const error  = params.get('error')
  const code   = params.get('code')

  if (error || !code) {
    message.value = t('auth.googleFailed')
    setTimeout(() => router.push('/login?error=google_failed'), 2000)
    return
  }

  try {
    const res = await api.get('/auth/exchange', {
      params: { code },
      withCredentials: true,
      skipAuthRedirect: true,
    })

    authStore.user = res.data.user
    router.push('/dashboard')
  } catch {
    message.value = t('auth.profileError')
    setTimeout(() => router.push('/login'), 2000)
  }
})
</script>
