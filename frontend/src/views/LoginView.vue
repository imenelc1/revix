<template>
  <AuthLayout>

    <!-- ===== Visual slot ===== -->
    <template #visual>
      <div class="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-primary-soft mb-4 opacity-0 animate-rise"
           style="animation-delay: 0.05s">
        <span class="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_theme(colors.primary)] animate-pulse-dot" />
        {{ t('hero.badge') }}
      </div>

      <h1 class="font-display text-4xl font-bold leading-[1.12] tracking-tight mb-4 opacity-0 animate-rise"
          style="animation-delay: 0.12s">
        {{ t('hero.title1') }}
        <span class="bg-gradient-to-br from-primary to-primary-soft bg-clip-text text-transparent">
          {{ t('hero.titleHighlight') }}
        </span>
      </h1>

      <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-9 opacity-0 animate-rise"
         style="animation-delay: 0.2s">
        {{ t('hero.description') }}
      </p>

      <!-- Live planner card -->
      <div
        class="group bg-white dark:bg-ink-800 border border-gray-200 dark:border-ink-600 rounded-2xl p-[18px] shadow-xl shadow-gray-200/50 dark:shadow-black/40 transition-all duration-300 hover:-translate-y-1 hover:border-primary opacity-0 animate-rise"
        style="animation-delay: 0.3s"
      >
        <div class="flex items-center justify-between mb-3.5">
          <div class="font-display font-bold text-sm">{{ t('hero.today') }}</div>
          <div class="font-mono text-[10px] tracking-wide bg-primary/10 text-primary-soft px-2.5 py-1 rounded-md">
            {{ t('hero.examMode') }}
          </div>
        </div>

        <div
          v-for="(session, i) in liveSessions"
          :key="session.name"
          class="flex items-center gap-3 py-2.5 rounded-lg transition-all duration-200 hover:px-2 hover:bg-gray-50 dark:hover:bg-ink-700"
          :class="i > 0 ? 'border-t border-gray-200 dark:border-ink-600' : ''"
        >
          <span class="w-2 h-2 rounded-full shrink-0" :style="{ background: session.color }" />
          <div class="flex-1">
            <div class="text-[13px] font-semibold">{{ session.name }}</div>
            <div class="text-[11px] font-mono text-gray-400 mt-0.5">{{ session.time }}</div>
          </div>
          <div
            class="w-[22px] h-[22px] rounded-full border-[1.5px] flex items-center justify-center text-[11px] transition-all"
            :class="session.done
              ? 'bg-primary border-primary text-white'
              : 'border-gray-300 dark:border-ink-600 text-transparent'"
          >
            <Check :size="12" v-if="session.done" />
          </div>
        </div>

        <!-- Progress bar -->
        <div class="flex items-center gap-3 mt-3.5 pt-3.5 border-t border-gray-200 dark:border-ink-600">
          <div class="flex-1 h-1.5 bg-gray-100 dark:bg-ink-700 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-primary to-primary-soft rounded-full animate-fill-bar-slow"
              style="--target-width: 68%"
            />
          </div>
          <div class="font-mono text-xs font-semibold text-primary-soft min-w-[36px] text-right">68%</div>
        </div>
      </div>
    </template>

    <!-- ===== Meta slot ===== -->
    <template #meta>
      <span class="flex items-center gap-1.5">
        <span class="w-1 h-1 rounded-full bg-current" />
        {{ t('hero.metaFree') }}
      </span>
      <span class="flex items-center gap-1.5">
        <span class="w-1 h-1 rounded-full bg-current" />
        {{ t('hero.metaAI') }}
      </span>
      <span class="flex items-center gap-1.5">
        <span class="w-1 h-1 rounded-full bg-current" />
        {{ t('hero.metaLang') }}
      </span>
    </template>

    <!-- ===== Form slot ===== -->
    <template #form>
      <div class="w-full max-w-[380px]">
        <h2
          class="font-display text-3xl font-bold tracking-tight mb-2.5 opacity-0 animate-rise"
          style="animation-delay: 0.15s"
        >
          {{ t('auth.welcomeBack') }}
        </h2>
        <p
          class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-8 opacity-0 animate-rise"
          style="animation-delay: 0.22s"
        >
          {{ t('auth.loginSubtitle') }}
        </p>

        <form @submit.prevent="onSubmit" class="space-y-4">
          <div class="opacity-0 animate-rise" style="animation-delay: 0.28s">
            <AppInput
              v-model="email"
              type="email"
              :label="t('auth.email')"
              :placeholder="t('auth.emailPlaceholder')"
              :icon="Mail"
              :error="errors.email"
            />
          </div>

          <div class="opacity-0 animate-rise" style="animation-delay: 0.34s">
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('auth.password') }}</label>
              <a href="#" class="text-xs text-primary-soft hover:text-primary transition">{{ t('auth.forgotPassword') }}</a>
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

          <div class="opacity-0 animate-rise" style="animation-delay: 0.4s">
            <AppButton type="submit" full-width size="lg" :loading="authStore.loading" class="group">
              {{ t('auth.loginButton') }}
              <template #icon-right>
                <ArrowRight :size="18" class="transition-transform group-hover:translate-x-1" />
              </template>
            </AppButton>
          </div>
        </form>

        <Divider class="my-6" />

        <div class="opacity-0 animate-rise" style="animation-delay: 0.52s">
          <GoogleButton />
        </div>

        <p class="text-center text-sm text-gray-500 dark:text-gray-400 mt-7 opacity-0 animate-rise" style="animation-delay: 0.58s">
          {{ t('auth.noAccount') }}
          <RouterLink to="/register" class="text-primary-soft hover:text-primary font-semibold transition">
            {{ t('auth.createAccount') }}
          </RouterLink>
        </p>
      </div>
    </template>

  </AuthLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Mail, Lock, ArrowRight, Check } from '@lucide/vue'
import AuthLayout from '@/features/auth/components/AuthLayout.vue'
import AppInput from '@/shared/components/AppInput.vue'
import AppButton from '@/shared/components/AppButton.vue'
import Divider from '@/features/auth/components/AuthDivider.vue'
import GoogleButton from '@/features/auth/components/AuthGoogleButton.vue'
import { useAuthStore } from '@/stores/auth.store'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const errors = reactive<{ email?: string; password?: string }>({})

const liveSessions = [
  { name: 'Bases de données — Indexation', time: '09:00 – 10:30', color: '#6366F1', done: true },
  { name: 'Algo — Tri rapide (révision)',   time: '11:00 – 12:00', color: '#FF8A5B', done: true },
  { name: 'Réseaux — Couche transport',     time: '14:00 – 15:30 · quiz inclus', color: '#4ABDAC', done: false },
]

function validate(): boolean {
  errors.email    = undefined
  errors.password = undefined
  if (!email.value)    errors.email    = t('auth.email') + ' requis'
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