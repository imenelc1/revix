<template>
  <AppButton
    variant="outline"
    full-width
    :loading="loading"
    @click="handleClick"
  >
    <template #icon-left>
      <GoogleIcon class="w-4 h-4" />
    </template>
    {{ t('buttons.google') }}
  </AppButton>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppButton from '@/shared/components/AppButton.vue'
import GoogleIcon from '@/shared/components/icons/GoogleIcon.vue' 
import { useAuthStore } from '@/stores/auth.store'
const { t } = useI18n()
const authStore = useAuthStore()
const loading   = ref(false)

function handleClick() {
  loading.value = true
  // Redirection vers Google OAuth — la page change, pas de retour
  authStore.loginWithGoogle()
}
</script>


