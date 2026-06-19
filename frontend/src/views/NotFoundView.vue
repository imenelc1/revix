<template>
  <div class="min-h-screen bg-surface dark:bg-ink-950 flex items-center justify-center px-6">
    <div class="text-center">
      <p class="font-mono text-8xl font-bold text-gray-100 dark:text-ink-800">404</p>
      <h1 class="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2 -mt-4">Page introuvable</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">Cette page n'existe pas ou a été déplacée.</p>
      <RouterLink to="/dashboard">
        <AppButton variant="primary" size="md">
          <template #icon-left><Home :size="16" /></template>
          Retour au dashboard
        </AppButton>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Home } from '@lucide/vue'
import AppButton from '@/shared/components/AppButton.vue'
</script>
