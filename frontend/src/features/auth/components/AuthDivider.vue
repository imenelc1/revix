<template>
  <div class="flex items-center gap-3 font-mono text-[11px] tracking-widest text-gray-400 dark:text-ink-600 opacity-0 animate-rise">
    <span class="flex-1 h-px bg-gray-200 dark:bg-ink-600" />
    {{ t('auth.orEmail').toUpperCase() }}
    <span class="flex-1 h-px bg-gray-200 dark:bg-ink-600" />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>