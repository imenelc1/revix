<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg bg-white dark:bg-ink-800 text-sm font-medium"
          :class="classesFor(toast.type)"
        >
          <component :is="iconFor(toast.type)" :size="18" class="shrink-0 mt-0.5" />
          <span class="flex-1 text-gray-800 dark:text-gray-200">{{ toast.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { CheckCircle2, XCircle, Info } from '@lucide/vue'
import { useToast } from '@/shared/composables/useToast'

const { toasts } = useToast()

function classesFor(type: string) {
  return {
    success: 'border-secondary/30',
    error:   'border-warm/30',
    info:    'border-primary/30',
  }[type] ?? 'border-gray-200'
}

function iconFor(type: string) {
  return {
    success: CheckCircle2,
    error: XCircle,
    info: Info,
  }[type] ?? Info
}
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from { opacity: 0; transform: translateX(20px); }
.toast-leave-to { opacity: 0; transform: translateX(20px); }
</style>