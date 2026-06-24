<template>
  <AuthLayout>
    <template #visual>
      <div class="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-primary-soft mb-4 opacity-0 animate-rise" style="animation-delay: 0.05s">
        <span class="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_theme(colors.primary)] animate-pulse-dot" />
        {{ t('hero.badge') }}
      </div>
      <h1 class="font-display text-4xl font-bold leading-[1.12] tracking-tight mb-4 opacity-0 animate-rise" style="animation-delay: 0.12s">
        {{ t('hero.title1') }}
        <span class="bg-gradient-to-br from-primary to-primary-soft bg-clip-text text-transparent">{{ t('hero.titleHighlight') }}</span>
      </h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-9 opacity-0 animate-rise" style="animation-delay: 0.2s">
        {{ t('hero.description') }}
      </p>
    </template>

    <template #form>
      <div class="w-full max-w-[380px] min-w-0">
        <h2 class="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-2.5">
          {{ t('auth.forgotPasswordTitle') }}
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
          {{ t('auth.forgotPasswordSubtitle') }}
        </p>

        <form v-if="!sent" @submit.prevent="onSubmit" class="space-y-4">
          <AppInput
            v-model="email"
            type="email"
            :label="t('auth.email')"
            :placeholder="t('auth.emailPlaceholder')"
            :icon="Mail"
            :error="errors.email"
          />

          <p v-if="authStore.error" class="text-sm text-red-500">{{ authStore.error }}</p>

          <AppButton type="submit" full-width size="lg" :loading="authStore.loading" class="group">
            {{ t('auth.sendResetLink') }}
            <template #icon-right>
              <ArrowRight :size="18" class="transition-transform group-hover:translate-x-1" />
            </template>
          </AppButton>
        </form>

        <div v-else class="text-center py-6">
          <div class="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 :size="24" class="text-secondary" />
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-300">{{ t('auth.checkEmailMessage') }}</p>
        </div>

        <p class="text-center text-sm text-gray-500 dark:text-gray-400 mt-7">
          <RouterLink to="/login" class="text-primary-soft hover:text-primary font-semibold transition">
            ← {{ t('auth.backToLogin') }}
          </RouterLink>
        </p>
      </div>
    </template>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Mail, ArrowRight, CheckCircle2 } from '@lucide/vue'
import AuthLayout from '@/features/auth/components/AuthLayout.vue'
import AppInput from '@/shared/components/AppInput.vue'
import AppButton from '@/shared/components/AppButton.vue'
import { useAuthStore } from '@/stores/auth.store'

const { t } = useI18n()
const authStore = useAuthStore()

const email = ref('')
const sent = ref(false)
const errors = reactive<{ email?: string }>({})

async function onSubmit() {
  errors.email = !email.value ? t('auth.errorEmailRequired') : undefined
  if (errors.email) return
  try {
    await authStore.forgotPassword(email.value)
    sent.value = true
  } catch {
    // erreur déjà affichée via authStore.error
  }
}
</script>