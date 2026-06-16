<template>
  <div
    :class="[
      'inline-block animate-spin rounded-full border-2 border-current border-t-transparent text-primary',
      sizes[size]
    ]"
    role="status"
    aria-label="Chargement…"
  />
</template>

<script setup lang="ts">
withDefaults(defineProps<{ size?: 'sm' | 'md' | 'lg' }>(), { size: 'md' })

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
}
</script>