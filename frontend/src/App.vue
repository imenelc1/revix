<template>
  <RouterView v-slot="{ Component, route }">
    <Transition :name="transitionName" mode="out-in">
      <component :is="Component" :key="route.path" />
    </Transition>
  </RouterView>
  <AppToast />
  <ConfirmDialog />
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useUiStore } from '@/stores/ui.store'
import AppToast from '@/shared/components/AppToast.vue'
import ConfirmDialog from '@/shared/components/ConfirmDialog.vue'

const route = useRoute()
const router = useRouter()
const ui = useUiStore()

const authRoutes = ['/login', '/register']

const transitionName = computed(() => {
  if (!authRoutes.includes(route.path)) return 'fade'
  return ui.slideDirection === 'right' ? 'auth-slide-right' : 'auth-slide-left'
})

// Détecter la direction au changement de route
router.beforeEach((to, from) => {
  if (from.path === '/login' && to.path === '/register') {
    ui.setSlideDirection('left')
  } else if (from.path === '/register' && to.path === '/login') {
    ui.setSlideDirection('right')
  }
})
</script>

<style>
/* ── Slide vers la gauche (login → register) ── */
.auth-slide-left-enter-active,
.auth-slide-left-leave-active,
.auth-slide-right-enter-active,
.auth-slide-right-leave-active {
  transition: transform 0.48s cubic-bezier(0.77, 0, 0.175, 1),
              opacity 0.48s cubic-bezier(0.77, 0, 0.175, 1);
  will-change: transform, opacity;
}

.auth-slide-left-enter-from {
  opacity: 0;
  transform: translateX(72px);
}
.auth-slide-left-leave-to {
  opacity: 0;
  transform: translateX(-72px);
}

.auth-slide-right-enter-from {
  opacity: 0;
  transform: translateX(-72px);
}
.auth-slide-right-leave-to {
  opacity: 0;
  transform: translateX(72px);
}

/* ── Fade générique ── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>