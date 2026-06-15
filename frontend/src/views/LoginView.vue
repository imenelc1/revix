<template>
  <div class="min-h-screen grid lg:grid-cols-[1.15fr_1fr] bg-white dark:bg-ink-950 text-gray-900 dark:text-gray-100">

    <!-- ===== Left: visual side (hidden on mobile) ===== -->
    <div class="hidden lg:flex relative flex-col justify-between p-11 overflow-hidden bg-gray-50 dark:bg-ink-900 border-r border-gray-200 dark:border-ink-600">

      <!-- ambient grain + glow -->
      <div class="absolute inset-0 pointer-events-none opacity-30 dark:opacity-60"
           style="background-image: radial-gradient(circle, currentColor 1px, transparent 1px); background-size: 22px 22px; color: theme('colors.gray.300');"
           :class="ui.theme === 'dark' ? 'text-white/10' : 'text-gray-300'"
      ></div>
      <div class="absolute -top-64 -left-52 w-[700px] h-[700px] rounded-full pointer-events-none blur-3xl animate-drift"
           :class="ui.theme === 'dark' ? 'bg-primary/15' : 'bg-primary/5'"
      ></div>

      <!-- logo -->
      <RouterLink to="/" class="relative z-10">
        <AppLogo size="md" />
      </RouterLink>

      <!-- headline + live card -->
      <div class="relative z-10 max-w-md">
        <div class="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-primary-soft mb-4 opacity-0 animate-rise" style="animation-delay: 0.05s">
          <span class="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_theme(colors.primary)] animate-pulse-dot"></span>
          3 EXAMENS DANS 9 JOURS
        </div>

        <h1 class="font-display text-4xl font-bold leading-[1.12] tracking-tight mb-4 opacity-0 animate-rise" style="animation-delay: 0.12s">
          Ton planning sait déjà
          <span class="bg-gradient-to-br from-primary to-primary-soft bg-clip-text text-transparent">par où commencer</span>
        </h1>

        <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-9 opacity-0 animate-rise" style="animation-delay: 0.2s">
          Pas besoin de réviser au feeling. Revix calcule chaque jour ce qui compte le plus selon ton niveau, la difficulté et la date de l'examen.
        </p>

        <!-- live planner card -->
        <div class="group bg-white dark:bg-ink-800 border border-gray-200 dark:border-ink-600 rounded-2xl p-[18px] shadow-xl shadow-gray-200/50 dark:shadow-black/40 transition-all duration-300 hover:-translate-y-1 hover:border-primary opacity-0 animate-rise" style="animation-delay: 0.3s">
          <div class="flex items-center justify-between mb-3.5">
            <div class="font-display font-bold text-sm">Aujourd'hui</div>
            <div class="font-mono text-[10px] tracking-wide bg-primary/10 text-primary-soft px-2.5 py-1 rounded-md">MODE EXAMEN</div>
          </div>

          <div
            v-for="(session, i) in liveSessions"
            :key="session.name"
            class="flex items-center gap-3 py-2.5 rounded-lg transition-all duration-200 hover:px-2 hover:bg-gray-50 dark:hover:bg-ink-700"
            :class="i > 0 ? 'border-t border-gray-200 dark:border-ink-600' : ''"
          >
            <span class="w-2 h-2 rounded-full shrink-0" :style="{ background: session.color }"></span>
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

          <!-- progress -->
          <div class="flex items-center gap-3 mt-3.5 pt-3.5 border-t border-gray-200 dark:border-ink-600">
            <div class="flex-1 h-1.5 bg-gray-100 dark:bg-ink-700 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-primary to-primary-soft rounded-full animate-fill-bar-slow" style="--target-width: 68%"></div>
            </div>
            <div class="font-mono text-xs font-semibold text-primary-soft min-w-[36px] text-right">68%</div>
          </div>
        </div>
      </div>

      <!-- bottom meta -->
      <div class="relative z-10 flex gap-6 font-mono text-xs text-gray-400 dark:text-ink-600 opacity-0 animate-rise" style="animation-delay: 0.5s">
        <span class="flex items-center gap-1.5"><span class="w-1 h-1 rounded-full bg-current"></span>100% gratuit</span>
        <span class="flex items-center gap-1.5"><span class="w-1 h-1 rounded-full bg-current"></span>IA Llama 3.3</span>
        <span class="flex items-center gap-1.5"><span class="w-1 h-1 rounded-full bg-current"></span>FR / EN</span>
      </div>
    </div>

    <!-- ===== Right: form side ===== -->
    <div class="flex items-center justify-center p-6 sm:p-12 relative">

      <!-- top bar: mobile logo + theme/lang toggles -->
      <div class="absolute top-6 left-6 right-6 flex items-center justify-between">
        <RouterLink to="/" class="lg:hidden">
          <AppLogo size="md" />
        </RouterLink>
        <div class="flex items-center gap-1 ml-auto">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>

      <div class="w-full max-w-[380px]">
        <h2 class="font-display text-3xl font-bold tracking-tight mb-2.5 opacity-0 animate-rise" style="animation-delay: 0.15s">
          {{ t('auth.welcomeBack') }}
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-8 opacity-0 animate-rise" style="animation-delay: 0.22s">
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

        <!-- divider -->
        <div class="flex items-center gap-3 my-6 font-mono text-[11px] tracking-widest text-gray-400 dark:text-ink-600 opacity-0 animate-rise" style="animation-delay: 0.46s">
          <span class="flex-1 h-px bg-gray-200 dark:bg-ink-600"></span>
          {{ t('auth.orEmail').toUpperCase() }}
          <span class="flex-1 h-px bg-gray-200 dark:bg-ink-600"></span>
        </div>

        <div class="opacity-0 animate-rise" style="animation-delay: 0.52s">
          <AppButton variant="outline" full-width>
            <template #icon-left>
              <svg class="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            </template>
            {{ t('buttons.google') }}
          </AppButton>
        </div>

        <p class="text-center text-sm text-gray-500 dark:text-gray-400 mt-7 opacity-0 animate-rise" style="animation-delay: 0.58s">
          {{ t('auth.noAccount') }}
          <RouterLink to="/register" class="text-primary-soft hover:text-primary font-semibold transition">{{ t('auth.createAccount') }}</RouterLink>
        </p>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Mail, Lock, ArrowRight, Check } from '@lucide/vue'
import AppButton from '@/shared/components/AppButton.vue'
import AppInput from '@/shared/components/AppInput.vue'
import AppLogo from '@/shared/components/AppLogo.vue'
import ThemeToggle from '@/shared/components/ThemeToggle.vue'
import LanguageToggle from '@/shared/components/LanguageToggle.vue'
import { useAuthStore } from '@/stores/auth.store'
import { useUiStore } from '@/stores/ui.store'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const ui = useUiStore()

const email = ref('')
const password = ref('')
const errors = reactive<{ email?: string; password?: string }>({})

// Mock data for the "live" planner card on the visual side
const liveSessions = [
  { name: 'Bases de données — Indexation', time: '09:00 – 10:30', color: '#6366F1', done: true },
  { name: 'Algo — Tri rapide (révision)', time: '11:00 – 12:00', color: '#FF8A5B', done: true },
  { name: 'Réseaux — Couche transport', time: '14:00 – 15:30 · quiz inclus', color: '#4ABDAC', done: false }
]

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