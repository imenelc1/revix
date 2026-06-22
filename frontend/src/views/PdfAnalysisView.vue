<template>
  <AppLayout :title="t('sidebar.iaAnalysis')">
    <div class="p-4 md:p-8 max-w-3xl mx-auto space-y-6">

      <!-- Upload zone -->
      <div
        class="bg-white dark:bg-ink-800 border-2 border-dashed border-gray-300 dark:border-ink-600 rounded-2xl p-10 text-center hover:border-primary transition cursor-pointer group shadow-sm"
        @click="triggerUpload"
        @dragover.prevent
        @drop.prevent="onDrop"
      >
        <div class="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition">
          <FileText :size="26" class="text-primary" />
        </div>
        <h3 class="font-display font-bold text-gray-900 dark:text-white mb-1">{{ t('analysis.uploadTitle') }}</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">{{ t('analysis.uploadDesc') }}</p>
        <p class="text-xs text-gray-400 font-mono">{{ t('analysis.uploadMeta') }}</p>
        <input ref="fileInput" type="file" accept=".pdf" class="hidden" @change="onFileSelect" />
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-8">
        <AppSpinner size="lg" />
        <p class="text-sm text-primary-soft font-mono mt-4 animate-pulse">{{ t('analysis.loadingText') }}</p>
      </div>

      <!-- Error -->
      <div v-if="errorMsg && !loading" class="bg-warm/10 border border-warm/30 rounded-2xl p-5 text-center">
        <p class="text-sm font-semibold text-warm">{{ errorMsg }}</p>
      </div>

      <!-- Results -->
      <div v-if="result && !loading">
        <div class="bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-2xl p-6 shadow-sm mb-4">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="font-display font-bold text-gray-900 dark:text-white">{{ result.subjectName }}</h3>
              <p class="text-xs text-gray-400 font-mono mt-0.5">
                {{ t('analysis.chaptersDetected', { count: result.totalChapters }) }}
              </p>
            </div>
            <span class="text-xs font-mono bg-primary/10 text-primary-soft px-3 py-1 rounded-full">Groq · Llama 3.3</span>
          </div>

          <div class="space-y-2 mb-6">
            <div
              v-for="(chapter, i) in result.chapters"
              :key="i"
              class="flex items-start gap-3 p-3 rounded-xl border border-gray-100 dark:border-ink-700 bg-gray-50 dark:bg-ink-900/50"
            >
              <input
                type="checkbox"
                :checked="selectedChapters.includes(i)"
                @change="toggleChapter(i)"
                class="mt-0.5 w-4 h-4 rounded accent-primary"
              />
              <div class="flex-1 min-w-0">
                <input
                  v-model="result.chapters[i].title"
                  class="w-full bg-transparent text-sm font-semibold text-gray-900 dark:text-white outline-none"
                />
                <div class="flex flex-wrap gap-1.5 mt-1.5">
                  <span
                    v-for="concept in chapter.keyConcepts.slice(0, 3)"
                    :key="concept"
                    class="text-[10px] font-mono text-gray-400 bg-gray-100 dark:bg-ink-700 px-1.5 py-0.5 rounded"
                  >{{ concept }}</span>
                </div>
              </div>
              <span
                class="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-lg"
                :class="difficultyClass(chapter.estimatedDifficulty).class"
              >
                {{ t(`onboarding.levels.${chapter.estimatedDifficulty}`) }}
              </span>
            </div>
          </div>

          <!-- Import -->
          <div class="flex items-center gap-3">
            <select
              v-model="targetSubjectId"
              class="flex-1 rounded-xl border border-gray-300 dark:border-ink-600 bg-white dark:bg-ink-900 text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            >
              <option value="">{{ t('analysis.importOptionPlaceholder') }}</option>
              <option v-for="s in subjectsStore.subjects" :key="s._id" :value="s._id">{{ s.name }}</option>
            </select>
            <AppButton variant="primary" size="sm" :loading="importing" @click="importChapters">
              <template #icon-left><Download :size="15" /></template>
              {{ t('analysis.btnImport', { count: selectedChapters.length }) }}
            </AppButton>
          </div>

          <p v-if="importSuccess" class="text-sm text-secondary mt-3 font-semibold">
             {{ t('analysis.importSuccess', { count: selectedChapters.length }) }}
          </p>
        </div>
      </div>

    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { FileText, Download } from '@lucide/vue'
import AppLayout from '@/shared/components/AppLayout.vue'
import AppButton from '@/shared/components/AppButton.vue'
import AppSpinner from '@/shared/components/AppSpinner.vue'
import { useSubjectsStore } from '@/stores/subjects.store'
import api from '@/shared/utils/api'

const { t } = useI18n()
const route = useRoute()
const subjectsStore = useSubjectsStore()

const fileInput = ref<HTMLInputElement | null>(null)
const loading = ref(false)
const importing = ref(false)
const importSuccess = ref(false)
const targetSubjectId = ref('')
const selectedChapters = ref<number[]>([])

interface AnalysisResult {
  subjectName: string
  totalChapters: number
  chapters: { title: string; keyConcepts: string[]; estimatedDifficulty: string; summary: string }[]
}
const result = ref<AnalysisResult | null>(null)
const errorMsg = ref('')
const currentFileName = ref('')

function triggerUpload() { fileInput.value?.click() }

function onDrop(e: DragEvent) {
  const file = e.dataTransfer?.files?.[0]
  if (file) analyze(file)
}

function onFileSelect(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) analyze(file)
}

async function analyze(file: File) {
  loading.value = true
  currentFileName.value = file.name
  result.value = null
  errorMsg.value = ''
  selectedChapters.value = []
  importSuccess.value = false
  try {
    const fd = new FormData()
    fd.append('pdf', file)
    const res = await api.post('/pdf/analyze', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    result.value = res.data
    selectedChapters.value = result.value!.chapters.map((_, i) => i)
  } catch (err: any) {
    console.error(err)
    errorMsg.value = err.response?.data?.error || 'Erreur lors de l\'analyse du PDF. Réessayez.'
  } finally {
    loading.value = false
  }
}

function toggleChapter(i: number) {
  const idx = selectedChapters.value.indexOf(i)
  if (idx === -1) selectedChapters.value.push(i)
  else selectedChapters.value.splice(idx, 1)
}

function difficultyClass(d: string) {
  const classes: Record<string, string> = { 
    low: 'bg-secondary/10 text-secondary', 
    medium: 'bg-accent/10 text-accent', 
    high: 'bg-warm/10 text-warm' 
  }
  return { class: classes[d] ?? 'bg-gray-100 text-gray-400' }
}

async function importChapters() {
  if (!targetSubjectId.value || !result.value) return
  importing.value = true
  try {
    const chapters = selectedChapters.value.map(i => result.value!.chapters[i])
    await api.post('/pdf/import', {
      subjectId: targetSubjectId.value,
      chapters,
      fileName: currentFileName.value
    })
    importSuccess.value = true
    await subjectsStore.fetchAll()
  } catch (err) {
    console.error(err)
  } finally {
    importing.value = false
  }
}

onMounted(async () => {
  await subjectsStore.fetchAll()
  const presetId = route.query.subjectId as string | undefined
  if (presetId) targetSubjectId.value = presetId
})
</script>