<template>
  <AppLayout :title="t('onboarding.addModuleTitle')" :subtitle="t('onboarding.moduleSubtitle')" :score="globalScore">

    <div class="flex-1 p-8">
      <!-- dot grid bg -->
      <div class="fixed inset-0 bg-[radial-gradient(#dde1ea_1px,transparent_1px)] dark:bg-[radial-gradient(#1e222d_1px,transparent_1px)] [background-size:20px_20px] opacity-60 pointer-events-none z-0" />

      <div class="relative z-10 max-w-2xl mx-auto">

        <!-- Stepper -->
        <div class="relative flex items-center justify-between mb-12 max-w-md mx-auto">
          <div class="absolute left-0 top-[18px] right-0 h-[2px] bg-gray-200 dark:bg-ink-700 -z-10" />
          <div
            class="absolute left-0 top-[18px] h-[2px] bg-primary transition-all duration-500 -z-10"
            :style="{ width: stepProgress }"
          />
          <div v-for="(label, i) in stepLabels" :key="i" class="flex flex-col items-center gap-2">
            <div
              class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2"
              :class="currentStep > i + 1
                ? 'bg-primary border-primary text-white'
                : currentStep === i + 1
                ? 'bg-white dark:bg-ink-800 border-primary text-primary shadow-[0_0_16px_rgba(99,102,241,0.35)]'
                : 'bg-white dark:bg-ink-800 border-gray-200 dark:border-ink-600 text-gray-400'"
            >
              <Check v-if="currentStep > i + 1" :size="16" />
              <span v-else>{{ i + 1 }}</span>
            </div>
            <span class="text-xs font-semibold" :class="currentStep >= i + 1 ? 'text-gray-900 dark:text-white' : 'text-gray-400'">
              {{ label }}
            </span>
          </div>
        </div>

        <!-- Card -->
        <div class="bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-2xl p-8 shadow-lg shadow-gray-200/30 dark:shadow-black/40">

          <!-- Step 1 — Identité -->
          <div v-if="currentStep === 1" class="space-y-6 animate-rise">
            <div>
              <h3 class="font-display text-xl font-bold mb-1 text-gray-900 dark:text-white">{{ t('onboarding.moduleInfo') }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('onboarding.moduleSubtitle') }}</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AppInput
                v-model="form.name"
                :label="t('onboarding.labelModuleName')"
                :placeholder="t('onboarding.placeholderModuleName')"
                :error="errors.name"
              />
              <div>
                <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                  {{ t('onboarding.labelExamDate') }}
                </label>
                <div class="relative">
                  <CalendarIcon :size="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    v-model="form.examDate"
                    class="w-full rounded-xl border border-gray-300 dark:border-ink-600 bg-white dark:bg-ink-900 text-gray-900 dark:text-white pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                  />
                </div>
                <p v-if="errors.examDate" class="mt-1.5 text-sm text-red-500">{{ errors.examDate }}</p>
              </div>
            </div>

            <!-- Couleur du module -->
            <div>
              <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">{{ t('onboarding.moduleColor') }}</label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="color in moduleColors"
                  :key="color"
                  @click="form.color = color"
                  class="w-8 h-8 rounded-lg transition-all duration-200 hover:scale-110"
                  :style="{ background: color }"
                  :class="form.color === color ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''"
                />
              </div>
            </div>
          </div>

          <!-- Step 2 — Chapitres -->
          <div v-if="currentStep === 2" class="space-y-5 animate-rise">
            <div>
              <h3 class="font-display text-xl font-bold mb-1 text-gray-900 dark:text-white">{{ t('onboarding.moduleContent') }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('onboarding.moduleContentSubtitle') }}</p>
            </div>

            <!-- PDF drop zone -->
            <div
              class="border-2 border-dashed border-gray-300 dark:border-ink-600 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-ink-900/50 hover:border-primary transition cursor-pointer group"
              @click="triggerPdfUpload"
            >
              <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-ink-800 flex items-center justify-center text-gray-500 group-hover:text-primary mb-3 transition">
                <UploadCloud :size="22" />
              </div>
              <p class="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">{{ t('onboarding.dragPdf') }}</p>
              <p class="text-xs text-gray-400">{{ t('onboarding.pdfMax') }}</p>
              <input ref="pdfInput" type="file" accept=".pdf" multiple class="hidden" @change="onPdfUpload" />
            </div>
            <div v-if="pdfFiles.length > 0 && !pdfLoading" class="space-y-1.5">
              <div
                v-for="(pdf, i) in pdfFiles"
                :key="i"
                class="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-primary/20 text-xs"
              >
                <FileText :size="13" class="text-primary shrink-0" />
                <span class="flex-1 truncate text-gray-700 dark:text-gray-300 font-medium">{{ pdf.fileName }}</span>
                <button @click="pdfFiles.splice(i, 1)" class="text-gray-300 hover:text-red-500 transition">
                  <X :size="13" />
                </button>
              </div>
              <button
                @click="triggerPdfUpload"
                class="flex items-center gap-1.5 text-xs font-semibold text-primary-soft hover:text-primary transition mt-1"
              >
                <Plus :size="13" /> {{ t('onboarding.addAnotherPdf') }}
              </button>
            </div>

            <p v-if="pdfLoading" class="text-sm text-primary-soft font-mono text-center">{{ t('onboarding.pdfAnalyzing') }}</p>

            <!-- Chapters list -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-mono font-bold uppercase text-gray-400">{{ t('onboarding.addedChapters') }}</span>
                <button @click="addChapter" class="text-xs font-semibold text-primary-soft hover:text-primary flex items-center gap-1 transition">
                  <Plus :size="14" /> {{ t('onboarding.addManually') }}
                </button>
              </div>

              <div v-if="form.chapters.length === 0" class="text-center py-6 text-sm text-gray-400">
                {{ t('onboarding.noChapters') }}
              </div>

              <div
                v-for="(chapter, idx) in form.chapters"
                :key="idx"
                class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-ink-900/60 border border-gray-200 dark:border-ink-700 rounded-xl group"
              >
                <span class="w-6 h-6 rounded-md bg-primary/10 text-primary-soft text-xs font-mono flex items-center justify-center shrink-0">{{ idx + 1 }}</span>
                <input
                  v-model="chapter.title"
                  class="flex-1 bg-transparent text-sm font-medium text-gray-800 dark:text-gray-200 outline-none placeholder:text-gray-300"
                  :placeholder="`${t('onboarding.chapterPlaceholderText')} ${idx + 1}`"
                />
                <button @click="removeChapter(idx)" class="text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100">
                  <Trash2 :size="15" />
                </button>
              </div>
            </div>
          </div>

          <!-- Step 3 — Auto-évaluation -->
          <div v-if="currentStep === 3" class="space-y-5 animate-rise">
            <div>
              <h3 class="font-display text-xl font-bold mb-1 text-gray-900 dark:text-white">{{ t('onboarding.selfEvaluation') }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('onboarding.selfEvaluationSubtitle') }}</p>
            </div>

            <div class="space-y-3">
              <div
                v-for="(chapter, idx) in form.chapters"
                :key="idx"
                class="p-4 bg-gray-50 dark:bg-ink-900/60 border border-gray-200 dark:border-ink-700 rounded-xl"
              >
                <p class="text-sm font-bold text-gray-900 dark:text-white mb-4">{{ chapter.title }}</p>

                <div class="grid grid-cols-2 gap-4">
                  <!-- Mastery -->
                  <div>
                    <p class="text-[11px] font-mono font-bold uppercase text-gray-400 mb-2">{{ t('onboarding.masteryLabel') }}</p>
                    <div class="flex gap-2">
                      <button
                        v-for="level in masteryLevels"
                        :key="level.value"
                        @click="chapter.masteryLevel = level.value"
                        :title="level.label"
                        class="w-9 h-9 rounded-lg border-2 flex items-center justify-center transition-all duration-200 hover:scale-110"
                        :class="chapter.masteryLevel === level.value ? `${level.activeClass} scale-110` : 'border-gray-200 dark:border-ink-600 text-gray-400'"
                      >
                        <component :is="level.icon" :size="16" />
                      </button>
                    </div>
                  </div>

                  <!-- Difficulty -->
                  <div>
                    <p class="text-[11px] font-mono font-bold uppercase text-gray-400 mb-2">{{ t('onboarding.difficultyLabel') }}</p>
                    <div class="flex bg-white dark:bg-ink-800 border border-gray-200 dark:border-ink-700 rounded-xl p-0.5 w-fit">
                      <button
                        v-for="level in difficultyLevels"
                        :key="level.value"
                        @click="chapter.difficulty = level.value"
                        class="px-3 py-1 text-xs font-medium rounded-lg transition-all"
                        :class="chapter.difficulty === level.value
                          ? 'bg-gray-100 dark:bg-ink-700 text-gray-900 dark:text-white font-bold shadow-sm'
                          : 'text-gray-400 hover:text-gray-600'"
                      >
                        {{ level.label }}
                      </button>
                    </div>
                  </div>

                  <!-- Importance -->
                  <div class="col-span-2">
                    <p class="text-[11px] font-mono font-bold uppercase text-gray-400 mb-2">{{ t('onboarding.importanceLabel') }}</p>
                    <div class="flex gap-1.5">
                      <button
                        v-for="n in 5"
                        :key="n"
                        @click="chapter.importanceScore = n"
                        class="w-8 h-8 rounded-lg border text-xs font-bold transition-all"
                        :class="chapter.importanceScore >= n
                          ? 'bg-primary text-white border-primary'
                          : 'border-gray-200 dark:border-ink-600 text-gray-400 hover:border-primary'"
                      >{{ n }}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-ink-700">
            <button
              v-if="currentStep > 1"
              @click="currentStep--"
              class="text-sm font-semibold text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
            >
              ← {{ t('onboarding.back') }}
            </button>
            <div v-else />

            <AppButton
              variant="primary"
              size="md"
              :loading="saving"
              @click="nextStep"
              class="group"
            >
              {{ currentStep === 3 ? t('onboarding.finishModule') : t('onboarding.continue') }}
              <template #icon-right>
                <Sparkles v-if="currentStep === 3" :size="16" />
                <ArrowRight v-else :size="16" class="transition-transform group-hover:translate-x-0.5" />
              </template>
            </AppButton>
          </div>

        </div>

        <!-- Error global -->
        <p v-if="saveError" class="text-sm text-red-500 text-center mt-4">{{ saveError }}</p>

      </div>
    </div>

  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowRight, Check, Plus, Trash2, UploadCloud, Sparkles,
  Frown, Meh, Smile, Calendar as CalendarIcon, FileText, X } from '@lucide/vue'
import AppLayout from '@/shared/components/AppLayout.vue'
import AppInput from '@/shared/components/AppInput.vue'
import AppButton from '@/shared/components/AppButton.vue'
import { useSubjectsStore } from '@/stores/subjects.store'
import api from '@/shared/utils/api'
import { useDocumentsStore } from '@/stores/documents.store'
import { useToast } from '@/shared/composables/useToast'
const toast = useToast()
const { t } = useI18n()
const router = useRouter()
const subjectsStore = useSubjectsStore()
const documentsStore = useDocumentsStore()

// ─── State ───────────────────────────────────────────────────────────────────
const currentStep = ref(1)
const saving      = ref(false)
const saveError   = ref('')
const pdfLoading  = ref(false)
const pdfInput    = ref<HTMLInputElement | null>(null)
const globalScore = ref(0)
const pdfFiles = ref<{ fileName: string; extractedText: string }[]>([])

const stepLabels = computed(() => [
  t('onboarding.stepIdentity'),
  t('onboarding.stepChapters'),
  t('onboarding.stepMastery')
])

const stepProgress = computed(() => {
  if (currentStep.value === 1) return '0%'
  if (currentStep.value === 2) return '50%'
  return '100%'
})

interface ChapterForm {
  title: string
  masteryLevel: 'not_understood' | 'average' | 'mastered'
  difficulty: 'low' | 'medium' | 'high'
  importanceScore: number
}

const form = reactive({
  name: '',
  examDate: '',
  color: '#6366F1',
  chapters: [] as ChapterForm[]
})

const errors = reactive<{ name?: string; examDate?: string }>({})

// ─── Options ─────────────────────────────────────────────────────────────────
const moduleColors = [
  '#6366F1', '#10B981', '#FF8A5B', '#4ABDAC',
  '#F59E0B', '#EC4899', '#8B5CF6', '#14B8A6'
]

const masteryLevels = [
  { value: 'not_understood', icon: Frown, label: t('onboarding.masteryNotUnderstood'), activeClass: 'border-red-500 bg-red-50 dark:bg-red-500/10 text-red-500' },
  { value: 'average',        icon: Meh,   label: t('onboarding.masteryAverage'),       activeClass: 'border-amber-500 bg-amber-50 dark:bg-amber-500/10 text-amber-500' },
  { value: 'mastered',       icon: Smile, label: t('onboarding.masteryMastered'),    activeClass: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500' }
]

const difficultyLevels = computed(() => [
  { value: 'low',    label: t('onboarding.levels.low') },
  { value: 'medium', label: t('onboarding.levels.medium') },
  { value: 'high',   label: t('onboarding.levels.high') }
])

// ─── Chapitres ────────────────────────────────────────────────────────────────
function addChapter() {
  form.chapters.push({ title: '', masteryLevel: 'average', difficulty: 'medium', importanceScore: 3 })
}

function removeChapter(idx: number) {
  form.chapters.splice(idx, 1)
}

// ─── PDF Upload → IA ─────────────────────────────────────────────────────────
function triggerPdfUpload() {
  pdfInput.value?.click()
}

async function onPdfUpload(e: Event) {
  const files = Array.from((e.target as HTMLInputElement).files || [])
  if (!files.length) return

  pdfLoading.value = true
  try {
    for (const file of files) {
      const fd = new FormData()
      fd.append('pdf', file)
      const res = await api.post('/pdf/analyze', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      const detected = res.data.chapters || []
      // Accumule les chapitres au lieu de remplacer
      const newChapters = detected.map((c: any) => ({
        title: c.title,
        masteryLevel: 'average' as const,
        difficulty: (c.estimatedDifficulty || 'medium') as 'low' | 'medium' | 'high',
        importanceScore: 3
      }))
      form.chapters.push(...newChapters)

      if (!form.name && res.data.subjectName) {
        form.name = res.data.subjectName
      }
      pdfFiles.value.push({
        fileName: file.name,
        extractedText: res.data.extractedText || ''
      })
    }
    // Reset input pour permettre de re-sélectionner les mêmes fichiers
    if (pdfInput.value) pdfInput.value.value = ''
  } catch (err) {
    console.error('PDF analysis error', err)
    toast.error(t('common.unexpectedError'))
  } finally {
    pdfLoading.value = false
  }
}
// ─── Validation ───────────────────────────────────────────────────────────────
function validateStep1(): boolean {
  errors.name     = !form.name     ? t('onboarding.errorModuleNameRequired') : undefined
  errors.examDate = !form.examDate ? t('onboarding.errorExamDateRequired')   : undefined
  return !errors.name && !errors.examDate
}

// ─── Navigation & save ────────────────────────────────────────────────────────
async function nextStep() {
  saveError.value = ''

  if (currentStep.value === 1) {
    if (!validateStep1()) return
    currentStep.value = 2
    return
  }

  if (currentStep.value === 2) {
    if (form.chapters.length === 0) {
      addChapter()
    }
    currentStep.value = 3
    return
  }

 // Step 3 → sauvegarder
saving.value = true
try {
  // 1. Créer le module (subject)
  const subject = await subjectsStore.create({
    name: form.name,
    color: form.color,
    examDate: form.examDate
  })

  // 2. Ajouter les chapitres un par un
  for (const chapter of form.chapters) {
    if (!chapter.title.trim()) continue
    await subjectsStore.addChapter(subject._id, {
      title: chapter.title,
      masteryLevel: chapter.masteryLevel,
      difficulty: chapter.difficulty,
      importanceScore: chapter.importanceScore
    })
  }

      // 3. Si un PDF a été analysé, persister le document + son texte pour le chatbot
 for (const pdf of pdfFiles.value) {
  if (pdf.extractedText) {
    await documentsStore.create(
      subject._id,
      pdf.fileName,
      form.chapters.length,
      pdf.extractedText
    )
  }
}

  // 4. Rediriger vers le dashboard
  router.push('/dashboard')
} catch (err: any) {
  saveError.value = err.response?.data?.error || t('onboarding.errorSaving')
  toast.error(t('common.unexpectedError'))
} finally {
  saving.value = false
}}
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
