<template>
  <img v-if="variant === 'full'" :src="logoFull" alt="Revix" :class="sizeClass" />
  <img v-else :src="logoIcon" alt="Revix" :class="iconSizeClass" />
</template>

<script setup lang="ts">
import logoFull from '@/assets/logo/logo.png'
import logoIcon from '@/assets/logo/icon.png'

const props = withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  variant?: 'full' | 'icon'
}>(), { size: 'md', variant: 'full' })

const sizeClass = {
  sm: 'h-10',
  md: 'h-12',
  lg: 'h-14',
  xl: 'h-20',
  '2xl': 'h-28'
}[props.size]

const iconSizeClass = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
  '2xl': 'h-20 w-20'
}[props.size]
</script>
