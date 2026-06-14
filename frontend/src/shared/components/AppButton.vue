<template>
  <component
    :is="to ? 'router-link' : 'button'"
    :to="to"
    :type="!to ? type : undefined"
    :disabled="disabled || loading"
    :class="classes"
  >
    <Loader2 v-if="loading" :size="iconSize" class="animate-spin" />
    <slot name="icon-left" />
    <slot />
    <slot name="icon-right" />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Loader2 } from '@lucide/vue'

interface Props {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  to?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  fullWidth: false
})

const iconSize = computed(() => (props.size === 'sm' ? 14 : props.size === 'lg' ? 20 : 16))

const variants = {
  primary: 'bg-primary text-white hover:bg-primary/90 disabled:bg-primary/50',
  outline: 'border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800',
  ghost: 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
  danger: 'bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300'
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base'
}

const classes = computed(() => [
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition disabled:cursor-not-allowed',
  variants[props.variant],
  sizes[props.size],
  props.fullWidth ? 'w-full' : ''
])
</script>
