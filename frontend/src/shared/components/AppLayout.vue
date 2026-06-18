<template>
  <div class="flex min-h-screen bg-surface dark:bg-ink-950 transition-colors duration-300">

    <!-- Sidebar — cachée sur mobile, visible sur lg+ -->
    <div class="hidden lg:block">
      <AppSidebar />
    </div>

    <!-- Mobile sidebar overlay -->
    <Transition name="sidebar-fade">
      <div v-if="sidebarOpen" class="fixed inset-0 z-40 lg:hidden" @click="sidebarOpen = false">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div class="absolute left-0 top-0 bottom-0 w-64 z-50" @click.stop>
          <AppSidebar />
        </div>
      </div>
    </Transition>

    <!-- Main -->
    <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
      <AppHeader
        :title="title"
        :subtitle="subtitle"
        :score="score"
        @toggle-sidebar="sidebarOpen = !sidebarOpen"
      />
      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppSidebar from '@/shared/components/AppSidebar.vue'
import AppHeader from '@/shared/components/AppHeader.vue'

withDefaults(defineProps<{
  title?: string
  subtitle?: string
  score?: number
}>(), { score: 0 })

const sidebarOpen = ref(false)
</script>

<style scoped>
.sidebar-fade-enter-active,
.sidebar-fade-leave-active {
  transition: opacity 0.25s ease;
}
.sidebar-fade-enter-from,
.sidebar-fade-leave-to {
  opacity: 0;
}
</style>
