import { createI18n } from 'vue-i18n'
import fr from './fr.json'
import en from './en.json'

// Détecter la langue du navigateur
function detectLocale(): 'fr' | 'en' {
  const saved = localStorage.getItem('locale')
  if (saved === 'fr' || saved === 'en') return saved

  const browserLang = navigator.language.toLowerCase()
  return browserLang.startsWith('fr') ? 'fr' : 'en'
}

export const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: 'en',
  messages: { fr, en }
})
