<template>
  <div class="min-h-screen grid lg:grid-cols-[1.15fr_1fr] bg-white dark:bg-ink-950 text-gray-900 dark:text-gray-100">

    <!-- ===== LEFT: Visual panel ===== -->
    <div class="hidden lg:flex relative flex-col justify-between p-11 overflow-hidden bg-gray-50 dark:bg-ink-900 border-r border-gray-200 dark:border-ink-600">

      <!-- Ambient grain -->
      <div
        class="absolute inset-0 pointer-events-none opacity-30 dark:opacity-60"
        :class="ui.theme === 'dark' ? 'text-white/10' : 'text-gray-300'"
        style="background-image: radial-gradient(circle, currentColor 1px, transparent 1px); background-size: 22px 22px;"
      />

      <!-- Primary glow -->
      <div
        class="absolute -top-64 -left-52 w-[700px] h-[700px] rounded-full pointer-events-none blur-3xl animate-drift"
        :class="ui.theme === 'dark' ? 'bg-primary/15' : 'bg-primary/5'"
      />

      <!-- Secondary glow (slot-driven: only register uses it) -->
      <slot name="extra-glow" />

      <!-- Logo -->
      <RouterLink to="/" class="relative z-10">
        <AppLogo size="2xl" />
      </RouterLink>

      <!-- Visual content: badge + headline + card -->
      <div class="relative z-10 max-w-md">
        <slot name="visual" />
      </div>

      <!-- Bottom meta -->
      <div
        class="relative z-10 flex gap-6 font-mono text-xs text-gray-400 dark:text-ink-600 opacity-0 animate-rise"
        style="animation-delay: 0.5s"
      >
        <slot name="meta">
          <!-- Default meta — overridable per page -->
          <span class="flex items-center gap-1.5">
            <span class="w-1 h-1 rounded-full bg-current" />
            100% gratuit
          </span>
          <span class="flex items-center gap-1.5">
            <span class="w-1 h-1 rounded-full bg-current" />
            IA Llama 3.3
          </span>
          <span class="flex items-center gap-1.5">
            <span class="w-1 h-1 rounded-full bg-current" />
            FR / EN
          </span>
        </slot>
      </div>
    </div>

    <!-- ===== RIGHT: Form panel ===== -->
    <div class="flex items-center justify-center p-6 sm:p-12 relative">

      <!-- Top bar: mobile logo + theme/lang toggles -->
      <div class="absolute top-6 left-6 right-6 flex items-center justify-between">
        <RouterLink to="/" class="lg:hidden">
          <AppLogo size="2xl" />
        </RouterLink>
        <div class="flex items-center gap-1 ml-auto">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>

      <!-- Form content -->
      <slot name="form" />
    </div>

  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppLogo from '@/shared/components/AppLogo.vue'
import ThemeToggle from '@/shared/components/ThemeToggle.vue'
import LanguageToggle from '@/shared/components/LanguageToggle.vue'
import { useUiStore } from '@/stores/ui.store'

const ui = useUiStore()
</script>