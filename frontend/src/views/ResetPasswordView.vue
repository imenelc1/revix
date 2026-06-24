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
          {{ t('auth.resetPasswordTitle') }}
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
          {{ t('auth.resetPasswordSubtitle') }}
        </p>

        <div v-if="!token" class="text-center py-6">
          <p class="text-sm text-red-500">{{ t('auth.errorTokenMissing') }}</p>
          <RouterLink to="/forgot-password" class="text-primary-soft hover:text-primary font-semibold text-sm mt-3 inline-block">
            {{ t('auth.sendResetLink') }}
          </RouterLink>
        </div>

        <form v-else-if="!success" @submit.prevent="onSubmit" class="space-y-4">
          <AppInput
            v-model="newPassword"
            type="password"
            :label="t('settings.newPassword')"
            :icon="Lock"
            placeholder="••••••••"
            :error="errors.newPassword"
          />
          <AppInput
            v-model="confirmPassword"
            type="password"
            :label="t('settings.confirmNewPassword')"
            :icon="Lock"
            placeholder="••••••••"
            :error="errors.confirmPassword"
          />

          <p v-if="apiError" class="text-sm text-red-500">{{ apiError }}</p>

          <AppButton type="submit" full-width size="lg" :loading="loading" class="group">
            {{ t('auth.resetPasswordButton') }}
            <template #icon-right>
              <ArrowRight :size="18" class="transition-transform group-hover:translate-x-1" />
            </template>
          </AppButton>
        </form>

        <div v-else class="text-center py-6">
          <div class="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
            <Check :size="24" class="text-secondary" />
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">{{ t('auth.resetSuccess') }}</p>
          <RouterLink to="/login">
            <AppButton variant="primary" size="md">{{ t('auth.signIn') }}</AppButton>
          </RouterLink>
        </div>
      </div>
    </template>
  </AuthLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Lock, ArrowRight, Check } from '@lucide/vue'
import AuthLayout from '@/features/auth/components/AuthLayout.vue'
import AppInput from '@/shared/components/AppInput.vue'
import AppButton from '@/shared/components/AppButton.vue'
import { useAuthStore } from '@/stores/auth.store'
import { isStrongPassword } from '@/shared/utils/password'

const { t } = useI18n()
const route = useRoute()
const authStore = useAuthStore()

const token = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const success = ref(false)
const apiError = ref('')
const errors = reactive<{ newPassword?: string; confirmPassword?: string }>({})

onMounted(() => {
  token.value = (route.query.token as string) || ''
})

function validate(): boolean {
  errors.newPassword = !isStrongPassword(newPassword.value) ? t('settings.errorPasswordWeak') : undefined
  errors.confirmPassword = newPassword.value !== confirmPassword.value ? t('auth.errorPasswordMatch') : undefined
  return !errors.newPassword && !errors.confirmPassword
}

async function onSubmit() {
  apiError.value = ''
  if (!validate()) return
  loading.value = true
  try {
    await authStore.resetPassword(token.value, newPassword.value)
    success.value = true
  } catch (err: any) {
    apiError.value = err.response?.data?.error || t('common.unexpectedError')
  } finally {
    loading.value = false
  }
}
</script>
