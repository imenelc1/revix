<template>
  <header class="h-16 shrink-0 flex items-center justify-between px-4 md:px-6 border-b border-surface-border dark:border-ink-700 bg-white dark:bg-ink-900 transition-colors duration-300">

    <!-- Left: menu mobile + title -->
    <div class="flex items-center gap-3">
      <!-- Burger menu — mobile only -->
      <button
        @click="$emit('toggle-sidebar')"
        class="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-ink-800 transition"
      >
        <Menu :size="20" />
      </button>

      <div>
        <h1 class="font-display text-base md:text-lg font-bold text-gray-900 dark:text-white tracking-tight">
          {{ title }}
        </h1>
        <p v-if="subtitle" class="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5 hidden md:block">
          {{ subtitle }}
        </p>
      </div>
    </div>

    <!-- Right: score + toggles -->
    <div class="flex items-center gap-2 md:gap-3">
      <div v-if="score > 0" class="hidden sm:flex items-center gap-2 bg-secondary/10 border border-secondary/20 px-3 py-1.5 rounded-full">
        <span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
        <span class="text-xs font-semibold text-secondary font-mono">{{ score }}%</span>
      </div>

      <LanguageToggle />
      <ThemeToggle />
    </div>

  </header>
</template>

<script setup lang="ts">
import { Menu } from '@lucide/vue'
import ThemeToggle from '@/shared/components/ThemeToggle.vue'
import LanguageToggle from '@/shared/components/LanguageToggle.vue'

defineEmits(['toggle-sidebar'])

withDefaults(defineProps<{
  title?: string
  subtitle?: string
  score?: number
}>(), { score: 0 })
</script>
