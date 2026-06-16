import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const theme = ref<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  )
  const slideDirection = ref<'left' | 'right'>('left')

  function applyTheme() {
    document.documentElement.classList.toggle('dark', theme.value === 'dark')
    localStorage.setItem('theme', theme.value)
  }

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  function setSlideDirection(direction: 'left' | 'right') {
    slideDirection.value = direction
  }

  watch(theme, applyTheme)
  applyTheme()

  return { theme, toggleTheme, slideDirection, setSlideDirection }
})