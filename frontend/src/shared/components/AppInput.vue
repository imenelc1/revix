<template>
  <div>
    <label v-if="label" class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
      {{ label }}
    </label>
    <div class="relative">
      <component
        :is="icon"
        v-if="icon"
        :size="18"
        class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        :type="showPassword ? 'text' : type"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :placeholder="placeholder"
        :class="[
          'w-full min-h-[44px] rounded-xl border bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition',
          icon ? 'pl-10' : '',
          type === 'password' ? 'pr-10' : ''
        ]"
      />
      <button
        v-if="type === 'password'"
        type="button"
        @click="showPassword = !showPassword"
        class="absolute right-0 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <Eye v-if="!showPassword" :size="18" />
        <EyeOff v-else :size="18" />
      </button>
    </div>
    <p v-if="error" class="mt-1.5 text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Eye, EyeOff } from '@lucide/vue'
import type { Component } from 'vue'

defineProps<{
  modelValue: string
  label?: string
  type?: string
  placeholder?: string
  icon?: Component
  error?: string
}>()

defineEmits(['update:modelValue'])

const showPassword = ref(false)
</script>
