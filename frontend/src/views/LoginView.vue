<template>
  <div class="min-h-screen grid md:grid-cols-2 bg-white dark:bg-gray-950">

    <!-- Left — form -->
    <div class="flex flex-col px-6 md:px-16 py-10">
      <RouterLink to="/" class="text-2xl font-bold text-primary mb-16">Revix</RouterLink>

      <div class="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">
        <h1 class="text-3xl font-bold mb-2">{{ t('auth.welcomeBack') }}</h1>
        <p class="text-gray-600 dark:text-gray-400 mb-8">{{ t('auth.loginSubtitle') }}</p>

        <!-- Social buttons -->
        <div class="grid grid-cols-2 gap-3 mb-6">
          <AppButton variant="outline" full-width>
            <template #icon-left>
              <svg class="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            </template>
            {{ t('buttons.google') }}
          </AppButton>
          <AppButton variant="outline" full-width>
            <template #icon-left>
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-3.04 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.06.28.06.43h.04zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.336-1.26-3.43-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.633.95 3.466.95.81 0 2.235-1.01 3.898-1.01.636 0 2.917.06 4.41 2.19-.116.074-2.633 1.534-2.633 4.71 0 3.61 3.137 4.85 3.27 4.92h.038z"/></svg>
            </template>
            {{ t('buttons.apple') }}
          </AppButton>
        </div>

        <div class="relative mb-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200 dark:border-gray-800"></div>
          </div>
          <div class="relative flex justify-center text-xs">
            <span class="bg-white dark:bg-gray-950 px-3 text-gray-400">{{ t('auth.orEmail') }}</span>
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

      <div class="flex justify-center gap-6 text-sm text-gray-400 mt-10">
        <a href="#" class="hover:text-primary transition">Aide</a>
        <a href="#" class="hover:text-primary transition">{{ t('footer.privacy') }}</a>
        <a href="#" class="hover:text-primary transition">Conditions</a>
      </div>
    </div>

    <!-- Right — visual panel -->
    <div class="hidden md:flex relative bg-primary overflow-hidden items-center justify-center p-12">
      <div class="absolute inset-0 [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]">
        <div class="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.15)_1px,_transparent_1px)] [background-size:24px_24px]"></div>
      </div>

      <div class="relative z-10 text-center max-w-md">
        <div class="relative inline-block mb-10">
          <div class="w-64 h-64 rounded-full bg-white/10 flex items-center justify-center">
            <div class="w-44 h-44 rounded-full bg-gray-950/80 flex items-center justify-center p-4">
              <div class="w-full h-full rounded-lg bg-gray-900 border border-white/10 p-3 flex flex-col gap-2">
                <div class="flex gap-1.5">
                  <div class="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                  <div class="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                  <div class="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                </div>
                <div class="h-1.5 bg-white/10 rounded-full w-3/4"></div>
                <div class="h-1.5 bg-primary/40 rounded-full w-1/2"></div>
                <div class="grid grid-cols-3 gap-1 mt-1">
                  <div class="h-6 bg-white/5 rounded"></div>
                  <div class="h-6 bg-secondary/30 rounded"></div>
                  <div class="h-6 bg-white/5 rounded"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="absolute -top-3 -right-3 w-12 h-12 rounded-2xl bg-accent rotate-12 flex items-center justify-center shadow-lg">
            <Sparkles :size="22" class="text-white" />
          </div>
          <div class="absolute -bottom-2 -left-4 w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg">
            <TrendingUp :size="22" class="text-primary" />
          </div>
        </div>

        <h2 class="text-3xl font-bold text-white mb-4 leading-tight">
          {{ t('landing.title1') }}
          <span class="underline decoration-wavy decoration-white/40">{{ t('landing.titleHighlight') }}</span>
        </h2>
        <p class="text-white/70">
          {{ t('landing.description') }}
        </p>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Mail, Lock, Sparkles, TrendingUp } from '@lucide/vue'
import AppButton from '@/shared/components/AppButton.vue'
import AppInput from '@/shared/components/AppInput.vue'
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
    // error is handled in store
  }
}
</script>