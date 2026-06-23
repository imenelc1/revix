<template>
  <AppModal :show="!!state" @close="handle(false)">
    <template v-if="state">
      <h3 class="font-display font-bold text-lg text-gray-900 dark:text-white mb-2">
        {{ state.title || t('common.confirmTitle') }}
      </h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">{{ state.message }}</p>
      <div class="flex justify-end gap-3">
        <button
          @click="handle(false)"
          class="px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-ink-700 transition"
        >
          {{ state.cancelLabel || t('common.cancel') }}
        </button>
        <button
          @click="handle(true)"
          class="px-4 py-2 rounded-xl text-sm font-semibold text-white transition"
          :class="state.danger ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'"
        >
          {{ state.confirmLabel || t('common.confirm') }}
        </button>
      </div>
    </template>
  </AppModal>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppModal from './AppModal.vue'
import { useConfirm } from '@/shared/composables/useConfirm'

const { t } = useI18n()
const { state, handle } = useConfirm()
</script>