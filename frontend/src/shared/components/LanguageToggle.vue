<template>
  <button
    @click="toggleLocale"
    class="px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase"
  >
    {{ locale === 'fr' ? 'EN' : 'FR' }}
  </button>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

function toggleLocale() {
  locale.value = locale.value === 'fr' ? 'en' : 'fr'
  localStorage.setItem('locale', locale.value)
}
</script>
