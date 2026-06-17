<template>
  <div class="min-h-screen bg-gray-50 dark:bg-ink-950 text-gray-900 dark:text-white font-sans flex flex-col transition-colors duration-300">
    <header class="flex items-center justify-between px-8 py-4 border-b border-gray-200 dark:border-ink-700 bg-white dark:bg-ink-950 transition-colors duration-300">
      <div class="flex items-center gap-2">
        <AppLogo variant="full" size="sm" />
      </div>
      
      <div class="flex items-center gap-4">
        <span class="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          Global Score: 85%
        </span>

        <div class="flex items-center bg-gray-100 dark:bg-ink-800 rounded-xl p-0.5 border border-gray-200 dark:border-ink-600">
          <button 
            @click="locale = 'fr'"
            :class="['px-2.5 py-1 text-xs font-mono rounded-lg transition-all font-bold', locale === 'fr' ? 'bg-white dark:bg-ink-600 text-primary dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200']"
          >
            FR
          </button>
          <button 
            @click="locale = 'en'"
            :class="['px-2.5 py-1 text-xs font-mono rounded-lg transition-all font-bold', locale === 'en' ? 'bg-white dark:bg-ink-600 text-primary dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200']"
          >
            EN
          </button>
        </div>

        <button 
          @click="uiStore.toggleTheme()" 
          class="p-2 rounded-xl bg-gray-100 dark:bg-ink-800 border border-gray-200 dark:border-ink-600 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
        >
          <Sun v-if="uiStore.theme === 'dark'" :size="18" />
          <Moon v-else :size="18" />
        </button>

        <div class="w-px h-5 bg-gray-200 dark:bg-ink-700" />

        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-soft flex items-center justify-center font-display font-bold text-sm text-white shadow-md select-none">
            {{ userInitials }}
          </div>
          <div class="hidden md:block text-left">
            <div class="text-xs font-bold leading-none mb-0.5">
              {{ authStore.user?.firstName || 'Student' }}
            </div>
            <div class="text-[10px] font-mono text-gray-400 leading-none">
              {{ authStore.user?.email }}
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="flex flex-1">
      <AppSidebar />

      <main class="flex-1 bg-gray-50 dark:bg-ink-950 flex flex-col p-8 items-center relative overflow-y-auto transition-colors duration-300">
        <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e222d_1px,transparent_1px)] [background-size:16px_16px] opacity-70 dark:opacity-40 pointer-events-none" />

        <div class="w-full max-w-3xl z-10 mt-4">
          <h1 class="font-display text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-12">
            {{ t('onboarding.addModuleTitle') }}
          </h1>

          <div class="relative flex items-center justify-between mb-16 max-w-xl mx-auto">
            <div class="absolute left-0 top-4 right-0 h-[2px] bg-gray-200 dark:bg-ink-700 -z-10" />
            <div 
              class="absolute left-0 top-4 h-[2px] bg-primary transition-all duration-500 -z-10"
              :style="{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }"
            />

            <div class="flex flex-col items-center gap-2">
              <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
                   :class="currentStep >= 1 ? 'bg-primary text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-white dark:bg-ink-800 text-gray-400 border border-gray-200 dark:border-ink-600'">
                1
              </div>
              <span class="text-xs font-semibold tracking-wide" :class="currentStep >= 1 ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'">
                {{ t('onboarding.stepIdentity') }}
              </span>
            </div>

            <div class="flex flex-col items-center gap-2">
              <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
                   :class="currentStep >= 2 ? 'bg-primary text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-white dark:bg-ink-800 text-gray-400 border border-gray-200 dark:border-ink-600'">
                2
              </div>
              <span class="text-xs font-semibold tracking-wide" :class="currentStep >= 2 ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'">
                {{ t('onboarding.stepChapters') }}
              </span>
            </div>

            <div class="flex flex-col items-center gap-2">
              <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
                   :class="currentStep >= 3 ? 'bg-primary text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-white dark:bg-ink-800 text-gray-400 border border-gray-200 dark:border-ink-600'">
                3
              </div>
              <span class="text-xs font-semibold tracking-wide" :class="currentStep >= 3 ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'">
                {{ t('onboarding.stepMastery') }}
              </span>
            </div>
          </div>

          <div class="bg-white dark:bg-ink-800/90 backdrop-blur-md border border-gray-200 dark:border-ink-600 rounded-2xl p-8 max-w-2xl mx-auto shadow-xl dark:shadow-2xl shadow-gray-200/50 dark:shadow-black/50">
            
            <div v-if="currentStep === 1" class="space-y-6 animate-rise">
              <div>
                <h3 class="font-display text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {{ t('onboarding.moduleInfo') }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ t('onboarding.moduleSubtitle') }}
                </p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <AppInput
                  v-model="moduleName"
                  :label="t('onboarding.labelModuleName')"
                  :placeholder="t('onboarding.placeholderModuleName')"
                />
                
                <div>
                  <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    {{ t('onboarding.labelExamDate') }}
                  </label>
                  <div class="relative">
                    <CalendarIcon :size="18" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      v-model="examDate"
                      class="w-full rounded-xl border bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div v-if="currentStep === 2" class="space-y-6 animate-rise">
              <div>
                <h3 class="font-display text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {{ t('onboarding.moduleContent') }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ t('onboarding.moduleContentSubtitle') }}
                </p>
              </div>

              <div class="border-2 border-dashed border-gray-300 dark:border-ink-600 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-ink-900/50 hover:border-primary dark:hover:border-primary transition cursor-pointer group">
                <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-ink-800 flex items-center justify-center text-gray-500 dark:text-gray-400 mb-3 group-hover:text-primary transition">
                  <UploadCloud :size="22" />
                </div>
                <p class="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                  {{ t('onboarding.dragPdf') }}
                </p>
                <p class="text-xs text-gray-400">
                  {{ t('onboarding.pdfMax') }}
                </p>
              </div>

              <div class="space-y-3 pt-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-mono tracking-wider uppercase text-gray-400 dark:text-gray-500 font-bold">
                    {{ t('onboarding.addedChapters') }}
                  </span>
                  <button @click="addManualChapter" class="text-xs font-semibold text-primary-soft hover:text-primary flex items-center gap-1 transition">
                    <Plus :size="14" /> {{ t('onboarding.addManually') }}
                  </button>
                </div>

                <div class="space-y-2">
                  <div v-for="(chapter, idx) in chapters" :key="idx" class="flex items-center justify-between p-4 bg-gray-50 dark:bg-ink-900/60 border border-gray-200 dark:border-ink-700 rounded-xl">
                    <span class="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {{ chapter.title }}
                    </span>
                    <button @click="removeChapter(idx)" class="text-gray-400 hover:text-red-500 transition">
                      <Trash2 :size="16" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="currentStep === 3" class="space-y-6 animate-rise">
              <div>
                <h3 class="font-display text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {{ t('onboarding.selfEvaluation') }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ t('onboarding.selfEvaluationSubtitle') }}
                </p>
              </div>

              <div class="space-y-4 pt-2">
                <div v-for="(chapter, idx) in chapters" :key="idx" class="p-4 bg-gray-50 dark:bg-ink-900/60 border border-gray-200 dark:border-ink-700 rounded-xl space-y-4">
                  <div class="flex flex-col">
                    <span class="text-sm font-bold text-gray-900 dark:text-white">{{ chapter.title }}</span>
                    <span class="text-xs text-gray-400">Concepts de base et définitions</span>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-200/60 dark:border-ink-700/60">
                    <div>
                      <span class="block text-[11px] font-mono font-bold text-gray-400 uppercase mb-2">Maîtrise</span>
                      <div class="flex items-center gap-1.5">
                        <button @click="chapter.mastery = 'low'" :class="['p-2 rounded-lg border text-sm transition', chapter.mastery === 'low' ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-white dark:bg-ink-800 border-gray-200 dark:border-ink-700 text-gray-400']">
                          <SmileX :size="16" />
                        </button>
                        <button @click="chapter.mastery = 'medium'" :class="['p-2 rounded-lg border text-sm transition', chapter.mastery === 'medium' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-white dark:bg-ink-800 border-gray-200 dark:border-ink-700 text-gray-400']">
                          <Meh :size="16" />
                        </button>
                        <button @click="chapter.mastery = 'high'" :class="['p-2 rounded-lg border text-sm transition', chapter.mastery === 'high' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-white dark:bg-ink-800 border-gray-200 dark:border-ink-700 text-gray-400']">
                          <Smile :size="16" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <span class="block text-[11px] font-mono font-bold text-gray-400 uppercase mb-2">Difficulté</span>
                      <div class="flex bg-white dark:bg-ink-800 rounded-xl p-0.5 border border-gray-200 dark:border-ink-700 w-fit">
                        <button v-for="level in ['Faible', 'Moyenne', 'Élevée']" :key="level" @click="chapter.difficulty = level"
                                :class="['px-3 py-1 text-xs font-medium rounded-lg transition-all', chapter.difficulty === level ? 'bg-gray-100 dark:bg-ink-700 text-gray-900 dark:text-white font-bold shadow-sm' : 'text-gray-400 hover:text-gray-600']">
                          {{ level }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-ink-700">
              <button 
                v-if="currentStep > 1" 
                class="text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
                @click="currentStep--"
              >
                {{ t('onboarding.back') }}
              </button>
              <div v-else />
              
              <AppButton variant="primary" size="md" @click="nextStep" class="px-6 group">
                {{ currentStep === 3 ? t('onboarding.finishModule') : t('onboarding.continue') }}
                <template #icon-right>
                  <Sparkles v-if="currentStep === 3" :size="16" />
                  <ArrowRight v-else :size="16" class="transition-transform group-hover:translate-x-0.5" />
                </template>
              </AppButton>
            </div>

          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { 
  Sun, Moon, ArrowRight, UploadCloud, Plus, Trash2, Sparkles,
  Frown as SmileX, Meh, Smile, Calendar as CalendarIcon 
} from '@lucide/vue'
import AppLogo from '@/shared/components/AppLogo.vue'
import AppInput from '@/shared/components/AppInput.vue'
import AppButton from '@/shared/components/AppButton.vue'
import AppSidebar from '@/shared/components/AppSidebar.vue'
import { useUiStore } from '@/stores/ui.store'
import { useAuthStore } from '@/stores/auth.store'

const { t, locale } = useI18n()
const uiStore = useUiStore()
const authStore = useAuthStore()

const currentStep = ref(1)
const moduleName = ref('')
const examDate = ref('')

// Liste reactive simulée d'après l'UI de l'étape 2 et 3
const chapters = reactive([
  { title: 'Chapitre 1 : Introduction aux marchés', mastery: 'low', difficulty: 'Moyenne' },
  { title: 'Chapitre 2 : Théorie du producteur', mastery: 'medium', difficulty: 'Élevée' }
])

const userInitials = computed(() => {
  const fName = authStore.user?.firstName || 'R'
  const lName = authStore.user?.lastName || 'X'
  return `${fName.charAt(0)}${lName.charAt(0)}`.toUpperCase()
})

function addManualChapter() {
  chapters.push({
    title: `Chapitre ${chapters.length + 1} : Nouvelle Notion`,
    mastery: 'medium',
    difficulty: 'Moyenne'
  })
}

function removeChapter(idx: number) {
  chapters.splice(idx, 1)
}

function nextStep() {
  if (currentStep.value < 3) {
    currentStep.value++
  } else {
    console.log('Finalisation du module', { name: moduleName.value, date: examDate.value, chapters })
  }
}
</script>

<style scoped>
input[type="date"]::-webkit-calendar-picker-indicator {
  background: transparent;
  bottom: 0;
  color: transparent;
  cursor: pointer;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: auto;
  height: auto;
}
</style>