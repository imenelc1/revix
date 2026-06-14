<template>
  <div :class="[
    'rounded-2xl p-6',
    variant === 'dark'
      ? 'bg-gray-900 dark:bg-gray-800 text-white'
      : variant === 'highlight'
      ? 'bg-primary/5 dark:bg-primary/10 border border-primary/20'
      : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800'
  ]">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'default' | 'dark' | 'highlight'
}>()
</script>
