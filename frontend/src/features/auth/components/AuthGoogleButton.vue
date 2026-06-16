<template>
  <AppButton variant="outline" full-width>
    <template #icon-left>
      <GoogleIcon class="w-4 h-4" />
    </template>
    {{ t('buttons.google') }}
  </AppButton>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppButton from '@/shared/components/AppButton.vue'
import GoogleIcon from '@/shared/components/GoogleIcon.vue' 

const { t } = useI18n()
</script>