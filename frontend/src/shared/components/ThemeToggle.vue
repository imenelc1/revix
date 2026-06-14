<template>
  <button
    @click="ui.toggleTheme()"
    class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-600 dark:text-gray-300"
    :aria-label="ui.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <Sun v-if="ui.theme === 'dark'" :size="20" />
    <Moon v-else :size="20" />
  </button>
</template>

<script setup lang="ts">
import { Sun, Moon } from '@lucide/vue'
import { useUiStore } from '@/stores/ui.store'

const ui = useUiStore()
</script>
