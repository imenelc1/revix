<template>
  <AppLayout :title="t('settings.title')" :subtitle="t('settings.subtitle')">
    <div class="p-4 md:p-8 max-w-3xl mx-auto space-y-6">

      <!-- Profil -->
      <div class="bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-2xl p-6 shadow-sm">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <User :size="18" class="text-primary" />
          </div>
          <div>
            <h2 class="font-display font-bold text-gray-900 dark:text-white">{{ t('settings.profileTitle') }}</h2>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('settings.profileSubtitle') }}</p>
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-4 mb-4">
          <AppInput v-model="profileForm.firstName" :label="t('auth.firstName')" :error="profileErrors.firstName" />
          <AppInput v-model="profileForm.lastName" :label="t('auth.lastName')" :error="profileErrors.lastName" />
        </div>

        <div class="mb-5">
          <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{{ t('auth.email') }}</label>
          <input
            :value="authStore.user?.email"
            disabled
            class="w-full rounded-xl border bg-gray-50 dark:bg-ink-900/60 border-gray-200 dark:border-ink-700 text-gray-400 px-4 py-3 text-sm cursor-not-allowed"
          />
          <p class="mt-1.5 text-xs text-gray-400">{{ t('settings.emailLocked') }}</p>
        </div>

        <div class="flex items-center gap-3">
          <AppButton variant="primary" size="sm" :loading="savingProfile" @click="saveProfile">
            <template #icon-left><Save :size="14" /></template>
            {{ t('settings.saveChanges') }}
          </AppButton>
          <Transition name="fade">
            <span v-if="profileSuccess" class="text-sm text-secondary font-semibold flex items-center gap-1.5">
              <Check :size="14" /> {{ t('settings.profileUpdated') }}
            </span>
          </Transition>
        </div>
      </div>

      <!-- Préférences -->
      <div class="bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-2xl p-6 shadow-sm">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center">
            <Palette :size="18" class="text-teal" />
          </div>
          <div>
            <h2 class="font-display font-bold text-gray-900 dark:text-white">{{ t('settings.preferencesTitle') }}</h2>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('settings.preferencesSubtitle') }}</p>
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-5">
          <!-- Thème -->
          <div>
            <label class="block text-xs font-mono font-bold uppercase text-gray-400 mb-2">{{ t('settings.theme') }}</label>
            <div class="flex bg-gray-50 dark:bg-ink-900 border border-gray-200 dark:border-ink-700 rounded-xl p-1 w-fit">
              <button
                @click="setTheme('light')"
                class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all"
                :class="ui.theme === 'light' ? 'bg-white shadow-sm text-gray-900 font-semibold' : 'text-gray-400 hover:text-gray-600'"
              >
                <Sun :size="14" /> {{ t('settings.themeLight') }}
              </button>
              <button
                @click="setTheme('dark')"
                class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all"
                :class="ui.theme === 'dark' ? 'bg-ink-700 shadow-sm text-white font-semibold' : 'text-gray-400 hover:text-gray-300'"
              >
                <Moon :size="14" /> {{ t('settings.themeDark') }}
              </button>
            </div>
          </div>

          <!-- Langue -->
          <div>
            <label class="block text-xs font-mono font-bold uppercase text-gray-400 mb-2">{{ t('settings.language') }}</label>
            <div class="flex bg-gray-50 dark:bg-ink-900 border border-gray-200 dark:border-ink-700 rounded-xl p-1 w-fit">
              <button
                @click="setLocale('fr')"
                class="px-3 py-1.5 text-sm font-medium rounded-lg transition-all"
                :class="locale === 'fr' ? 'bg-white dark:bg-ink-700 shadow-sm text-gray-900 dark:text-white font-semibold' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'"
              >
                Français
              </button>
              <button
                @click="setLocale('en')"
                class="px-3 py-1.5 text-sm font-medium rounded-lg transition-all"
                :class="locale === 'en' ? 'bg-white dark:bg-ink-700 shadow-sm text-gray-900 dark:text-white font-semibold' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'"
              >
                English
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Sécurité -->
      <div class="bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-2xl p-6 shadow-sm">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-10 rounded-xl bg-warm/10 flex items-center justify-center">
            <KeyRound :size="18" class="text-warm" />
          </div>
          <div>
            <h2 class="font-display font-bold text-gray-900 dark:text-white">{{ t('settings.securityTitle') }}</h2>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('settings.securitySubtitle') }}</p>
          </div>
        </div>

        <div v-if="authStore.user?.isGoogleAccount" class="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-ink-900/60 border border-gray-100 dark:border-ink-700">
          <GoogleIcon class="w-5 h-5 shrink-0" />
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('settings.googleAccountNotice') }}</p>
        </div>

        <div v-else class="space-y-4">
          <AppInput v-model="passwordForm.currentPassword" type="password" :label="t('settings.currentPassword')" :error="passwordErrors.currentPassword" />
          <div class="grid sm:grid-cols-2 gap-4">
            <AppInput v-model="passwordForm.newPassword" type="password" :label="t('settings.newPassword')" :error="passwordErrors.newPassword" />
            <AppInput v-model="passwordForm.confirmNewPassword" type="password" :label="t('settings.confirmNewPassword')" :error="passwordErrors.confirmNewPassword" />
          </div>

          <p v-if="passwordApiError" class="text-sm text-red-500">{{ passwordApiError }}</p>

          <div class="flex items-center gap-3">
            <AppButton variant="outline" size="sm" :loading="savingPassword" @click="savePassword">
              <template #icon-left><Lock :size="14" /></template>
              {{ t('settings.changePassword') }}
            </AppButton>
            <Transition name="fade">
              <span v-if="passwordSuccess" class="text-sm text-secondary font-semibold flex items-center gap-1.5">
                <Check :size="14" /> {{ t('settings.passwordUpdated') }}
              </span>
            </Transition>
          </div>
        </div>
      </div>

      <!-- Compte -->
      <div class="bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-2xl p-6 shadow-sm">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-ink-700 flex items-center justify-center">
            <Shield :size="18" class="text-gray-500 dark:text-gray-300" />
          </div>
          <div>
            <h2 class="font-display font-bold text-gray-900 dark:text-white">{{ t('settings.accountTitle') }}</h2>
            <p v-if="authStore.user?.createdAt" class="text-xs text-gray-500 dark:text-gray-400">
              {{ t('settings.memberSince') }} {{ formatMemberSince(authStore.user.createdAt) }}
            </p>
          </div>
        </div>

        <AppButton variant="danger" size="sm" @click="handleLogout">
          <template #icon-left><LogOut :size="14" /></template>
          {{ t('settings.logoutAccount') }}
        </AppButton>
      </div>

    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { User, Save, Check, Palette, Sun, Moon, KeyRound, Lock, Shield, LogOut } from '@lucide/vue'
import AppLayout from '@/shared/components/AppLayout.vue'
import AppInput from '@/shared/components/AppInput.vue'
import AppButton from '@/shared/components/AppButton.vue'
import GoogleIcon from '@/shared/components/icons/GoogleIcon.vue'
import { useAuthStore } from '@/stores/auth.store'
import { useUiStore } from '@/stores/ui.store'

const { t, locale } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const ui = useUiStore()

// ── Thème & langue ──────────────────────────────────────────────────────────────
function setTheme(value: 'light' | 'dark') {
  if (ui.theme !== value) ui.toggleTheme()
}
function setLocale(value: 'fr' | 'en') {
  locale.value = value
  localStorage.setItem('locale', value)
}

// ── Profil ──────────────────────────────────────────────────────────────────────
const profileForm = reactive({
  firstName: authStore.user?.firstName || '',
  lastName: authStore.user?.lastName || ''
})
const profileErrors = reactive<{ firstName?: string; lastName?: string }>({})
const savingProfile = ref(false)
const profileSuccess = ref(false)

function validateProfile(): boolean {
  profileErrors.firstName = profileForm.firstName.trim().length < 2 ? t('settings.errorFirstNameShort') : undefined
  profileErrors.lastName  = profileForm.lastName.trim().length < 2  ? t('settings.errorLastNameShort')  : undefined
  return !profileErrors.firstName && !profileErrors.lastName
}

async function saveProfile() {
  profileSuccess.value = false
  if (!validateProfile()) return
  savingProfile.value = true
  try {
    await authStore.updateProfile(profileForm.firstName, profileForm.lastName)
    profileSuccess.value = true
    setTimeout(() => { profileSuccess.value = false }, 3000)
  } catch (err) {
    console.error(err)
  } finally {
    savingProfile.value = false
  }
}

// ── Mot de passe ────────────────────────────────────────────────────────────────
const passwordForm = reactive({ currentPassword: '', newPassword: '', confirmNewPassword: '' })
const passwordErrors = reactive<{ currentPassword?: string; newPassword?: string; confirmNewPassword?: string }>({})
const passwordApiError = ref('')
const savingPassword = ref(false)
const passwordSuccess = ref(false)

function validatePassword(): boolean {
  passwordErrors.currentPassword = !passwordForm.currentPassword ? t('settings.errorCurrentPasswordRequired') : undefined
  passwordErrors.newPassword = passwordForm.newPassword.length < 8 ? t('settings.errorPasswordMinLength') : undefined
  passwordErrors.confirmNewPassword = passwordForm.newPassword !== passwordForm.confirmNewPassword
    ? t('auth.errorPasswordMatch')
    : undefined
  return !passwordErrors.currentPassword && !passwordErrors.newPassword && !passwordErrors.confirmNewPassword
}

async function savePassword() {
  passwordApiError.value = ''
  passwordSuccess.value = false
  if (!validatePassword()) return
  savingPassword.value = true
  try {
    await authStore.changePassword(passwordForm.currentPassword, passwordForm.newPassword)
    passwordSuccess.value = true
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmNewPassword = ''
    setTimeout(() => { passwordSuccess.value = false }, 3000)
  } catch (err: any) {
    passwordApiError.value = err.response?.data?.error || t('settings.errorChangePassword')
  } finally {
    savingPassword.value = false
  }
}

// ── Compte ──────────────────────────────────────────────────────────────────────
function formatMemberSince(date: string): string {
  return new Date(date).toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : 'en-US', { month: 'long', year: 'numeric' })
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>