<template>
  <AuthLayout>

    <!-- ===== Extra glow (register only) ===== -->
    <template #extra-glow>
      <div
        class="absolute bottom-0 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none blur-3xl animate-drift-reverse"
        :class="ui.theme === 'dark' ? 'bg-warm/10' : 'bg-warm/5'"
      />
    </template>

    <!-- ===== Visual slot ===== -->
    <template #visual>
      <div
        class="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-primary-soft mb-4 opacity-0 animate-rise"
        style="animation-delay: 0.05s"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_theme(colors.primary)] animate-pulse-dot" />
        {{ t('onboarding.badge') }}
      </div>

      <h1
        class="font-display text-4xl font-bold leading-[1.12] tracking-tight mb-4 opacity-0 animate-rise"
        style="animation-delay: 0.12s"
      >
        {{ t('onboarding.title1') }}
        <span class="bg-gradient-to-br from-primary to-primary-soft bg-clip-text text-transparent">
          {{ t('onboarding.titleHighlight') }}
        </span>
      </h1>

      <p
        class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-9 opacity-0 animate-rise"
        style="animation-delay: 0.2s"
      >
        {{ t('onboarding.description') }}
      </p>

      <!-- Onboarding preview card -->
      <div
        class="group bg-white dark:bg-ink-800 border border-gray-200 dark:border-ink-600 rounded-2xl p-[18px] shadow-xl shadow-gray-200/50 dark:shadow-black/40 transition-all duration-300 hover:-translate-y-1 hover:border-primary opacity-0 animate-rise"
        style="animation-delay: 0.3s"
      >
        <div class="flex items-center justify-between mb-3.5">
          <div class="font-display font-bold text-sm">{{ t('onboarding.cardTitle') }}</div>
          <div class="font-mono text-[10px] tracking-wide bg-primary/10 text-primary-soft px-2.5 py-1 rounded-md">
            {{ t('onboarding.cardBadge', { count: onboardingModules.length }) }}
          </div>
        </div>

        <div
          v-for="(module, i) in onboardingModules"
          :key="module.name"
          class="flex items-center gap-3 py-2.5 rounded-lg transition-all duration-200 hover:px-2 hover:bg-gray-50 dark:hover:bg-ink-700"
          :class="i > 0 ? 'border-t border-gray-200 dark:border-ink-600' : ''"
        >
          <span class="w-2 h-2 rounded-full shrink-0" :style="{ background: module.color }" />
          <div class="flex-1">
            <div class="text-[13px] font-semibold">{{ module.name }}</div>
            <div class="text-[11px] font-mono text-gray-400 mt-0.5">{{ module.meta }}</div>
          </div>
          <div class="font-mono text-[11px] text-gray-400 dark:text-ink-600">{{ module.chapters }}</div>
        </div>

        <!-- Add module row -->
        <div class="flex items-center gap-3 py-2.5 mt-1 rounded-lg border-t border-dashed border-gray-200 dark:border-ink-600 text-gray-400 dark:text-ink-600">
          <span class="w-5 h-5 rounded-full border border-dashed border-gray-300 dark:border-ink-600 flex items-center justify-center shrink-0">
            <Plus :size="11" />
          </span>
          <div class="text-[12px] font-medium">{{ t('onboarding.addModule') }}</div>
        </div>
      </div>
    </template>

    <!-- ===== Meta slot ===== -->
    <template #meta>
      <span class="flex items-center gap-1.5">
        <span class="w-1 h-1 rounded-full bg-current" />
        {{ t('onboarding.metaFree') }}
      </span>
      <span class="flex items-center gap-1.5">
        <span class="w-1 h-1 rounded-full bg-current" />
        {{ t('onboarding.metaAI') }}
      </span>
      <span class="flex items-center gap-1.5">
        <span class="w-1 h-1 rounded-full bg-current" />
        {{ t('onboarding.metaLang') }}
      </span>
    </template>

    <!-- ===== Form slot ===== -->
    <template #form>
      <div class="w-full max-w-[400px] min-w-0">
        <h2
          class="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-2.5 opacity-0 animate-rise"
          style="animation-delay: 0.15s"
        >
          {{ t('auth.registerTitle') }}
        </h2>
        <p
          class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-7 opacity-0 animate-rise"
          style="animation-delay: 0.22s"
        >
          {{ t('auth.registerSubtitle2') }}
        </p>

        <form @submit.prevent="onSubmit" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 opacity-0 animate-rise" style="animation-delay: 0.26s">
            <AppInput
              v-model="firstName"
              :label="t('auth.firstName')"
              :placeholder="t('auth.firstNamePlaceholder')"
              :icon="User"
              :error="errors.firstName"
            />
            <AppInput
              v-model="lastName"
              :label="t('auth.lastName')"
              :placeholder="t('auth.lastNamePlaceholder')"
              :error="errors.lastName"
            />
          </div>

          <div class="opacity-0 animate-rise" style="animation-delay: 0.30s">
            <AppInput
              v-model="email"
              type="email"
              :label="t('auth.registerEmail')"
              :placeholder="t('auth.emailPlaceholder')"
              :icon="Mail"
              :error="errors.email"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 opacity-0 animate-rise" style="animation-delay: 0.34s">
            <AppInput
              v-model="password"
              type="password"
              :label="t('auth.password')"
              :icon="Lock"
              placeholder="••••••••"
              :error="errors.password"
            />
            <AppInput
              v-model="confirmPassword"
              type="password"
              :label="t('auth.confirmPassword')"
              :icon="Lock"
              placeholder="••••••••"
              :error="errors.confirmPassword"
            />
          </div>

          <!-- Terms checkbox -->
          <label class="min-h-[44px] flex items-start gap-2.5 cursor-pointer opacity-0 animate-rise" style="animation-delay: 0.38s">
            <input
              type="checkbox"
              v-model="acceptTerms"
              class="mt-0.5 w-5 h-5 rounded border-gray-300 dark:border-ink-600 text-primary focus:ring-primary/40 bg-white dark:bg-ink-800 shrink-0"
            />
            <span class="text-[13px] text-gray-500 dark:text-gray-400 leading-snug">
              {{ t('auth.terms') }}
              <RouterLink to="/legal" class="text-primary-soft hover:text-primary transition">{{ t('auth.termsLink') }}</RouterLink>
              {{ t('auth.and') }}
              <RouterLink to="/privacy" class="text-primary-soft hover:text-primary transition">{{ t('auth.privacyLink') }}</RouterLink>
            </span>
          </label>
          <p v-if="errors.terms" class="text-sm text-red-500 -mt-1">{{ errors.terms }}</p>

          <p v-if="authStore.error" class="text-sm text-red-500">{{ authStore.error }}</p>

          <div class="opacity-0 animate-rise" style="animation-delay: 0.44s">
            <AppButton type="submit" full-width size="lg" :loading="authStore.loading" class="group">
              {{ t('auth.registerButton') }}
              <template #icon-right>
                <ArrowRight :size="18" class="transition-transform group-hover:translate-x-1" />
              </template>
            </AppButton>
          </div>
        </form>

        <Divider class="my-6" />

        <div class="opacity-0 animate-rise" style="animation-delay: 0.56s">
          <GoogleButton />
        </div>

        <p class="text-center text-sm text-gray-500 dark:text-gray-400 mt-7 opacity-0 animate-rise" style="animation-delay: 0.62s">
          {{ t('auth.hasAccount') }}
          <RouterLink to="/login" class="text-primary-soft hover:text-primary font-semibold transition">
            {{ t('auth.signIn') }}
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
import { Mail, Lock, User, Plus, ArrowRight } from '@lucide/vue'
import AuthLayout from '@/features/auth/components/AuthLayout.vue'
import AppInput from '@/shared/components/AppInput.vue'
import AppButton from '@/shared/components/AppButton.vue'
import Divider from '@/features/auth/components/AuthDivider.vue'
import GoogleButton from '@/features/auth/components/AuthGoogleButton.vue'
import { useAuthStore } from '@/stores/auth.store'
import { useUiStore } from '@/stores/ui.store'
import { isStrongPassword } from '@/shared/utils/password'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const ui = useUiStore()

const firstName      = ref('')
const lastName       = ref('')
const email          = ref('')
const password       = ref('')
const confirmPassword = ref('')
const acceptTerms    = ref(false)

const errors = reactive<{
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  confirmPassword?: string
  terms?: string
}>({})

const onboardingModules = [
  { name: 'Bases de données', meta: 'Examen dans 9 jours',  chapters: '6 ch.', color: '#6366F1' },
  { name: 'Algorithmique',    meta: 'Examen dans 12 jours', chapters: '8 ch.', color: '#FF8A5B' },
  { name: 'Réseaux',          meta: 'Examen dans 15 jours', chapters: '5 ch.', color: '#4ABDAC' },
]

function validate(): boolean {
  errors.firstName      = undefined
  errors.lastName       = undefined
  errors.email          = undefined
  errors.password       = undefined
  errors.confirmPassword = undefined
  errors.terms          = undefined

  if (!firstName.value)  errors.firstName      = t('auth.errorFirstNameRequired')
  if (!lastName.value)   errors.lastName       = t('auth.errorLastNameRequired')
  if (!email.value)      errors.email          = t('auth.errorEmailRequired')
  if (!password.value) errors.password = t('auth.errorPasswordRequired')
  else if (!isStrongPassword(password.value)) errors.password = t('auth.errorPasswordWeak')
  if (password.value !== confirmPassword.value) errors.confirmPassword = t('auth.errorPasswordMatch')
  if (!acceptTerms.value) errors.terms         = t('auth.errorTerms')

  return !errors.firstName && !errors.lastName && !errors.email
      && !errors.password && !errors.confirmPassword && !errors.terms
}

async function onSubmit() {
  if (!validate()) return
  try {
    await authStore.register(firstName.value, lastName.value, email.value, password.value)
    router.push('/onboarding')
  } catch {
    // error handled in store
  }
}
</script>
