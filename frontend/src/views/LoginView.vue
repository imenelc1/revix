<template>
  <div class="min-h-screen relative flex items-center justify-center bg-white dark:bg-gray-950 px-6 py-12 overflow-hidden">

    <!-- Background glow + grid -->
    <div class="absolute inset-0 -z-10">
      <div class="absolute inset-0 bg-[radial-gradient(circle,_theme(colors.gray.200)_1px,_transparent_1px)] dark:bg-[radial-gradient(circle,_theme(colors.gray.800)_1px,_transparent_1px)] [background-size:32px_32px] opacity-50"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px]"></div>
      <div class="absolute top-1/3 left-2/3 w-[300px] h-[300px] rounded-full bg-secondary/15 blur-[100px]"></div>
    </div>

    <!-- Top left logo -->
    <RouterLink to="/" class="absolute top-8 left-8 z-10">
      <AppLogo size="lg" />
    </RouterLink>

    <!-- Card -->
    <div class="relative z-10 w-full max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-8">
      <h1 class="text-2xl font-bold mb-1">{{ t('auth.welcomeBack') }}</h1>
      <p class="text-gray-600 dark:text-gray-400 text-sm mb-6">{{ t('auth.loginSubtitle') }}</p>

      <!-- Google -->
      <AppButton variant="outline" full-width class="mb-5">
        <template #icon-left>
          <svg class="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        </template>
        {{ t('buttons.google') }}
      </AppButton>

      <div class="relative mb-5">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-200 dark:border-gray-800"></div>
        </div>
        <div class="relative flex justify-center text-xs">
          <span class="bg-white dark:bg-gray-900 px-3 text-gray-400">{{ t('auth.orEmail') }}</span>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="onSubmit" class="space-y-4">
        <AppInput
          v-model="email"
          type="email"
          :label="t('auth.email')"
          :placeholder="t('auth.emailPlaceholder')"
          :icon="Mail"
          :error="errors.email"
        />

        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('auth.password') }}</label>
            <a href="#" class="text-sm text-primary hover:underline">{{ t('auth.forgotPassword') }}</a>
          </div>
          <AppInput
            v-model="password"
            type="password"
            :icon="Lock"
            placeholder="••••••••"
            :error="errors.password"
          />
        </div>

        <p v-if="authStore.error" class="text-sm text-red-500">{{ authStore.error }}</p>

        <AppButton type="submit" full-width size="lg" :loading="authStore.loading">
          {{ t('auth.loginButton') }}
        </AppButton>
      </form>

      <p class="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
        {{ t('auth.noAccount') }}
        <RouterLink to="/register" class="text-primary font-semibold hover:underline">{{ t('auth.createAccount') }}</RouterLink>
      </p>
    </div>

    <!-- Footer links -->
    <div class="absolute bottom-6 flex justify-center gap-6 text-sm text-gray-400 z-10">
      <a href="#" class="hover:text-primary transition">Aide</a>
      <a href="#" class="hover:text-primary transition">{{ t('footer.privacy') }}</a>
      <a href="#" class="hover:text-primary transition">Conditions</a>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Mail, Lock } from '@lucide/vue'
import AppButton from '@/shared/components/AppButton.vue'
import AppInput from '@/shared/components/AppInput.vue'
import AppLogo from '@/shared/components/AppLogo.vue'
import { useAuthStore } from '@/stores/auth.store'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errors = reactive<{ email?: string; password?: string }>({})

function validate(): boolean {
  errors.email = undefined
  errors.password = undefined

  if (!email.value) errors.email = t('auth.email') + ' requis'
  if (!password.value) errors.password = t('auth.password') + ' requis'

  return !errors.email && !errors.password
}

async function onSubmit() {
  if (!validate()) return
  try {
    await authStore.login(email.value, password.value)
    router.push('/dashboard')
  } catch {
    // error handled in store
  }
}
</script>
