<template>
  <AppLayout :title="t('study.title')">
    <div class="p-4 md:p-8 max-w-4xl mx-auto space-y-6">

      <!-- Onglets -->
      <div class="flex gap-1 border-b border-gray-200 dark:border-ink-700 mb-2">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors"
          :class="activeTab === tab.id
            ? 'border-primary text-primary dark:text-primary-soft'
            : 'border-transparent text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
        >
          <component :is="tab.icon" :size="15" />
          {{ tab.label }}
          <span
            v-if="tab.count > 0"
            class="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary-soft font-mono"
          >{{ tab.count }}</span>
        </button>
      </div>

      <!-- ══ ONGLET GÉNÉRER ══ -->
      <div v-if="activeTab === 'generate'" class="space-y-4">
        <div class="bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-2xl p-6 shadow-sm">
          <h2 class="font-display font-bold text-gray-900 dark:text-white mb-4">{{ t('study.generateTitle') }}</h2>

          <div class="mb-4">
            <label class="block text-xs font-mono font-bold uppercase text-gray-400 mb-2">{{ t('study.labelModule') }}</label>
            <select
              v-model="selectedSubjectId"
              class="w-full rounded-xl border border-gray-300 dark:border-ink-600 bg-white dark:bg-ink-900 text-gray-900 dark:text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            >
              <option value="">{{ t('study.selectModule') }}</option>
              <option v-for="s in subjectsStore.subjects" :key="s._id" :value="s._id">{{ s.name }}</option>
            </select>
          </div>

          <!-- PDF drop zone -->
          <div
            class="border-2 border-dashed border-gray-300 dark:border-ink-600 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-ink-900/50 hover:border-primary transition cursor-pointer group mb-4"
            @click="triggerUpload"
            @dragover.prevent
            @drop.prevent="onDrop"
          >
            <div class="w-10 h-10 rounded-xl bg-gray-100 dark:bg-ink-800 flex items-center justify-center text-gray-500 group-hover:text-primary mb-3 transition">
              <FileUp :size="22" />
            </div>
            <p v-if="!selectedFile" class="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">{{ t('study.dropPdf') }}</p>
            <p v-else class="text-sm font-semibold text-primary mb-1">{{ selectedFile.name }}</p>
            <p class="text-xs text-gray-400">{{ t('study.pdfMeta') }}</p>
            <input ref="fileInput" type="file" accept=".pdf" class="hidden" @change="onFileSelect" />
          </div>

          <div class="flex gap-3">
            <AppButton variant="primary" size="sm" :disabled="!canGenerate" :loading="generating === 'flashcards'" @click="generate('flashcards')">
              <template #icon-left><Layers :size="15" /></template>
              {{ t('study.btnFlashcards') }}
            </AppButton>
            <AppButton variant="outline" size="sm" :disabled="!canGenerate" :loading="generating === 'quiz'" @click="generate('quiz')">
              <template #icon-left><HelpCircle :size="15" /></template>
              {{ t('study.btnQuiz') }}
            </AppButton>
          </div>
        </div>

        <!-- Résultat flashcards générées -->
        <div v-if="generatedFlashcards.length > 0">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-display font-bold text-gray-900 dark:text-white">
              {{ t('study.flashcardsTitle', { count: generatedFlashcards.length }) }}
            </h3>
            <span class="text-xs text-gray-400 font-mono">{{ t('study.clickToFlip') }}</span>
          </div>
          <div class="grid sm:grid-cols-2 gap-3">
            <div
              v-for="(card, i) in generatedFlashcards"
              :key="i"
              class="bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-xl p-4 shadow-sm cursor-pointer hover:-translate-y-0.5 transition-all"
              :class="card.flipped ? 'border-primary/40 bg-primary/5 dark:bg-primary/10' : ''"
              @click="card.flipped = !card.flipped"
            >
              <div class="font-mono text-[10px] text-gray-400 uppercase mb-2">
                {{ card.flipped ? t('study.cardAnswer') : t('study.cardQuestion') }}
              </div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ card.flipped ? card.answer : card.question }}
              </p>
            </div>
          </div>
          <div class="text-center mt-4">
            <AppButton variant="outline" size="sm" @click="goToFlashcards">{{ t('study.viewInHistory') }} →</AppButton>
          </div>
        </div>

        <!-- Résultat quiz généré -->
        <div v-if="generatedQuiz">
          <h3 class="font-display font-bold text-gray-900 dark:text-white mb-3">{{ t('study.quizTitle') }}</h3>
          <QuizPlayer :quiz="generatedQuiz" @completed="onGeneratedQuizCompleted" />
          <div class="text-center mt-4">
            <AppButton variant="outline" size="sm" @click="goToQuizzes">{{ t('study.viewInHistory') }} →</AppButton>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="generatedFlashcards.length === 0 && !generatedQuiz" class="text-center py-16">
          <div class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Layers :size="28" class="text-primary" />
          </div>
          <h3 class="font-display font-bold text-xl text-gray-900 dark:text-white mb-2">{{ t('study.emptyTitle') }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('study.emptyDescription') }}</p>
        </div>
      </div>

      <!-- ══ ONGLET MES FLASHCARDS ══ -->
      <div v-if="activeTab === 'flashcards'" class="space-y-4">
        <div class="flex items-center gap-3">
          <select
            v-model="filterSubjectId"
            class="flex-1 rounded-xl border border-gray-300 dark:border-ink-600 bg-white dark:bg-ink-900 text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            @change="loadFlashcards"
          >
            <option value="">{{ t('study.allModules') }}</option>
            <option v-for="s in subjectsStore.subjects" :key="s._id" :value="s._id">{{ s.name }}</option>
          </select>
          <span class="text-xs font-mono text-gray-400 whitespace-nowrap">{{ allFlashcards.length }} {{ t('study.cardsUnit') }}</span>
        </div>

        <div v-if="loadingFlashcards" class="flex justify-center py-12">
          <AppSpinner size="md" />
        </div>

        <div v-else-if="allFlashcards.length === 0" class="text-center py-16">
          <div class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Layers :size="28" class="text-primary" />
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">{{ t('study.noFlashcards') }}</p>
          <AppButton variant="primary" size="sm" @click="activeTab = 'generate'">
            <template #icon-left><Plus :size="14" /></template>
            {{ t('study.btnFlashcards') }}
          </AppButton>
        </div>

        <!-- Groupés par module — showAll stocké dans showAllMap, pas dans le computed -->
        <div v-else>
          <div
            v-for="group in flashcardGroups"
            :key="group.subjectId"
            class="bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-2xl p-5 shadow-sm mb-4"
          >
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full" :style="{ background: group.color }"></span>
                <span class="font-display font-bold text-gray-900 dark:text-white">{{ group.name }}</span>
                <span class="text-xs font-mono text-gray-400">{{ group.cards.length }} {{ t('study.cardsUnit') }}</span>
              </div>
              <span class="text-xs text-gray-400 font-mono">{{ group.date }}</span>
            </div>

            <div class="grid sm:grid-cols-2 gap-2">
              <div
                v-for="card in showAllMap[group.subjectId] ? group.cards : group.cards.slice(0, 4)"
                :key="card._id"
                class="relative border rounded-xl p-3 cursor-pointer hover:-translate-y-0.5 transition-all group/card"
                :class="card.flipped
                  ? 'border-primary/40 bg-primary/5 dark:bg-primary/10'
                  : 'border-gray-100 dark:border-ink-700 bg-gray-50 dark:bg-ink-900/50'"
                @click="card.flipped = !card.flipped"
              >
                <div class="text-[10px] font-mono uppercase text-gray-400 mb-1.5">
                  {{ card.flipped ? t('study.cardAnswer') : t('study.cardQuestion') }}
                </div>
                <p class="text-sm text-gray-900 dark:text-white">{{ card.flipped ? card.answer : card.question }}</p>
                <button
                  @click.stop="deleteFlashcard(card._id)"
                  class="absolute top-2 right-2 p-1 rounded text-gray-300 hover:text-red-500 opacity-0 group-hover/card:opacity-100 transition"
                >
                  <Trash2 :size="12" />
                </button>
              </div>
            </div>

            <div v-if="group.cards.length > 4" class="text-center mt-3">
              <button
                @click="showAllMap[group.subjectId] = !showAllMap[group.subjectId]"
                class="text-xs font-semibold text-primary-soft hover:text-primary transition"
              >
                {{ showAllMap[group.subjectId] ? t('study.collapse') + ' ↑' : t('study.moreCards', { count: group.cards.length - 4 }) }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ══ ONGLET MES QUIZ ══ -->
      <div v-if="activeTab === 'quizzes'" class="space-y-4">
        <div class="flex items-center gap-3">
          <select
            v-model="filterSubjectId"
            class="flex-1 rounded-xl border border-gray-300 dark:border-ink-600 bg-white dark:bg-ink-900 text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            @change="loadQuizzes"
          >
            <option value="">{{ t('study.allModules') }}</option>
            <option v-for="s in subjectsStore.subjects" :key="s._id" :value="s._id">{{ s.name }}</option>
          </select>
          <span class="text-xs font-mono text-gray-400 whitespace-nowrap">{{ allQuizzes.length }} {{ t('study.quizzesUnit') }}</span>
        </div>

        <!-- Stats globales -->
        <div v-if="allQuizzes.length > 0" class="grid grid-cols-3 gap-3">
          <div class="bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-xl p-4 text-center shadow-sm">
            <p class="font-display text-2xl font-bold text-gray-900 dark:text-white">{{ allQuizzes.length }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ t('study.generatedQuizzes') }}</p>
          </div>
          <div class="bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-xl p-4 text-center shadow-sm">
            <p class="font-display text-2xl font-bold text-secondary">{{ avgScore }}%</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ t('study.avgScore') }}</p>
          </div>
          <div class="bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-xl p-4 text-center shadow-sm">
            <p class="font-display text-2xl font-bold text-gray-900 dark:text-white">{{ totalQuestions }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ t('study.totalQuestions') }}</p>
          </div>
        </div>

        <div v-if="loadingQuizzes" class="flex justify-center py-12">
          <AppSpinner size="md" />
        </div>

        <div v-else-if="allQuizzes.length === 0" class="text-center py-16">
          <div class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <HelpCircle :size="28" class="text-primary" />
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">{{ t('study.noQuizzes') }}</p>
          <AppButton variant="primary" size="sm" @click="activeTab = 'generate'">
            <template #icon-left><Plus :size="14" /></template>
            {{ t('study.btnQuiz') }}
          </AppButton>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="quiz in allQuizzes"
            :key="quiz._id"
            class="bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-2xl p-5 shadow-sm"
          >
            <div class="flex items-start gap-4">
              <!-- Score ring -->
              <div class="relative w-14 h-14 shrink-0">
                <svg viewBox="0 0 36 36" class="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" stroke-width="2.5" class="text-gray-100 dark:text-ink-700"/>
                  <circle
                    cx="18" cy="18" r="14" fill="none" stroke="currentColor" stroke-width="2.5"
                    stroke-dasharray="100"
                    :stroke-dashoffset="quiz.userScore !== undefined ? (100 - quiz.userScore) : 100"
                    class="text-primary transition-all duration-700"
                    stroke-linecap="round"
                  />
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="font-mono text-xs font-bold text-primary">
                    {{ quiz.userScore !== undefined ? quiz.userScore + '%' : '—' }}
                  </span>
                </div>
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="w-2 h-2 rounded-full" :style="{ background: subjectColor(quiz.subjectId) }"></span>
                  <span class="font-display font-bold text-gray-900 dark:text-white text-sm">{{ subjectName(quiz.subjectId) }}</span>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ quiz.questions.length }} {{ t('study.questionsUnit') }} ·
                  {{ quiz.userScore !== undefined
                    ? Math.round(quiz.userScore / 100 * quiz.questions.length) + '/' + quiz.questions.length + ' ' + t('study.correct')
                    : t('study.notSubmitted') }}
                </p>
                <p class="text-xs text-gray-400 font-mono mt-1">{{ formatDate(quiz.createdAt) }}</p>
              </div>

              <!-- Actions -->
              <div class="flex gap-2 shrink-0">
                <AppButton variant="primary" size="sm" :loading="loadingQuizDetail && openQuizId !== quiz._id ? false : undefined" @click="toggleQuiz(quiz._id)">
                  {{ openQuizId === quiz._id ? t('study.close') : quiz.userScore !== undefined ? t('study.retry') : t('study.start') }}
                </AppButton>
                <button
                  @click="removeQuiz(quiz._id)"
                  class="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                >
                  <Trash2 :size="15" />
                </button>
              </div>
            </div>

            <!-- Quiz player inline -->
            <div v-if="openQuizId === quiz._id" class="mt-5 pt-5 border-t border-gray-100 dark:border-ink-700">
              <div v-if="loadingQuizDetail" class="flex justify-center py-6">
                <AppSpinner size="sm" />
              </div>
              <!-- key= force le remount complet à chaque ouverture (reset propre) -->
              <QuizPlayer
                v-else-if="openQuizData"
                :key="quiz._id + '-' + quizAttempt[quiz._id]"
                :quiz="openQuizData"
                @completed="onQuizCompleted(quiz, $event)"
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Layers, HelpCircle, FileUp, Trash2, Plus } from '@lucide/vue'
import AppLayout from '@/shared/components/AppLayout.vue'
import AppButton from '@/shared/components/AppButton.vue'
import AppSpinner from '@/shared/components/AppSpinner.vue'
import QuizPlayer from '@/features/study/QuizPlayer.vue'
import { useSubjectsStore } from '@/stores/subjects.store'
import { useToast } from '@/shared/composables/useToast'
import { formatDateWithYear } from '@/shared/utils/dates'
import api from '@/shared/utils/api'

const { t, locale } = useI18n()
const subjectsStore = useSubjectsStore()
const toast = useToast()

// ── Onglets ──────────────────────────────────────────────────────────────────
const activeTab = ref<'generate' | 'flashcards' | 'quizzes'>('generate')

const tabs = computed(() => [
  { id: 'generate',   label: t('study.tabGenerate'),     icon: Layers,     count: 0 },
  { id: 'flashcards', label: t('study.tabMyFlashcards'), icon: Layers,     count: allFlashcards.value.length },
  { id: 'quizzes',    label: t('study.tabMyQuizzes'),    icon: HelpCircle, count: allQuizzes.value.length },
])

function goToFlashcards() { activeTab.value = 'flashcards' }
function goToQuizzes()    { activeTab.value = 'quizzes' }

watch(activeTab, (tab) => {
  if (tab === 'flashcards') loadFlashcards()
  if (tab === 'quizzes')    loadQuizzes()
})

// ── Génération ───────────────────────────────────────────────────────────────
const selectedSubjectId = ref('')
const selectedFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const generating = ref<'flashcards' | 'quiz' | null>(null)
const canGenerate = computed(() => !!selectedSubjectId.value && !!selectedFile.value)

interface FlashcardData { _id: string; subjectId: string; question: string; answer: string; createdAt: string; flipped: boolean }
interface QuizQuestion  { question: string; options: string[]; correctIndex?: number; explanation?: string }
interface QuizData      { _id: string; subjectId: string; questions: QuizQuestion[]; userScore?: number; createdAt: string }

const generatedFlashcards = ref<FlashcardData[]>([])
const generatedQuiz = ref<QuizData | null>(null)

function triggerUpload() { fileInput.value?.click() }
function onDrop(e: DragEvent) { const f = e.dataTransfer?.files?.[0]; if (f) selectedFile.value = f }
function onFileSelect(e: Event) { const f = (e.target as HTMLInputElement).files?.[0]; if (f) selectedFile.value = f }

async function generate(type: 'flashcards' | 'quiz') {
  if (!canGenerate.value || !selectedFile.value) return
  generating.value = type
  try {
    const fd = new FormData()
    fd.append('pdf', selectedFile.value)
    fd.append('subjectId', selectedSubjectId.value)

    if (type === 'flashcards') {
      const res = await api.post('/flashcards/generate-from-pdf', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      generatedFlashcards.value = res.data.map((f: any) => ({ ...f, flipped: false }))
      generatedQuiz.value = null
    } else {
      const res = await api.post('/flashcards/quiz/generate-from-pdf', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      generatedQuiz.value = res.data
      generatedFlashcards.value = []
    }
  } catch (err) {
    console.error(err)
    toast.error(t('common.unexpectedError'))
  } finally {
    generating.value = null
  }
}

function onGeneratedQuizCompleted(score: number) {
  if (generatedQuiz.value) generatedQuiz.value.userScore = score
}

// ── Historique flashcards ─────────────────────────────────────────────────────
const filterSubjectId   = ref('')
const allFlashcards     = ref<FlashcardData[]>([])
const loadingFlashcards = ref(false)

// showAll stocké ICI (ref reactive), pas dans le computed → pas de perte d'état
const showAllMap = reactive<Record<string, boolean>>({})

const flashcardGroups = computed(() => {
  const map: Record<string, {
    subjectId: string; name: string; color: string; date: string; cards: FlashcardData[]
  }> = {}

  for (const card of allFlashcards.value) {
    if (!map[card.subjectId]) {
      const subj = subjectsStore.subjects.find(s => s._id === card.subjectId)
      map[card.subjectId] = {
        subjectId: card.subjectId,
        name: subj?.name ?? t('study.unknownModule'),
        color: subj?.color ?? '#6366F1',
        date: formatDate(card.createdAt),
        cards: []
      }
    }
    map[card.subjectId].cards.push(card)
  }

  return Object.values(map)
})

async function loadFlashcards() {
  loadingFlashcards.value = true
  try {
    const ids = filterSubjectId.value
      ? [filterSubjectId.value]
      : subjectsStore.subjects.map(s => s._id)

    const results = await Promise.all(
      ids.map(id => api.get(`/flashcards/subject/${id}`).then(r => r.data))
    )
    allFlashcards.value = results.flat().map((f: any) => ({ ...f, flipped: false }))
  } catch (err) {
    console.error(err)
    toast.error(t('common.unexpectedError'))
  } finally {
    loadingFlashcards.value = false
  }
}

async function deleteFlashcard(cardId: string) {
  try {
    await api.delete(`/flashcards/${cardId}`)
    allFlashcards.value = allFlashcards.value.filter(c => c._id !== cardId)
  } catch (err) {
    console.error(err)
    toast.error(t('common.unexpectedError'))
  }
}

// ── Historique quiz ───────────────────────────────────────────────────────────
const allQuizzes        = ref<QuizData[]>([])
const loadingQuizzes     = ref(false)
const openQuizId         = ref<string | null>(null)
const openQuizData       = ref<QuizData | null>(null)
const loadingQuizDetail  = ref(false)
// compteur d'essai par quiz — incrémenter force le remount de QuizPlayer (reset propre)
const quizAttempt = reactive<Record<string, number>>({})

const avgScore = computed(() => {
  const scored = allQuizzes.value.filter(q => q.userScore !== undefined)
  if (!scored.length) return 0
  return Math.round(scored.reduce((s, q) => s + (q.userScore ?? 0), 0) / scored.length)
})

const totalQuestions = computed(() =>
  allQuizzes.value.reduce((s, q) => s + q.questions.length, 0)
)

async function loadQuizzes() {
  loadingQuizzes.value = true
  try {
    const ids = filterSubjectId.value
      ? [filterSubjectId.value]
      : subjectsStore.subjects.map(s => s._id)

    const results = await Promise.all(
      ids.map(id => api.get(`/flashcards/quiz/subject/${id}`).then(r => r.data))
    )
    allQuizzes.value = results.flat().sort(
      (a: QuizData, b: QuizData) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  } catch (err) {
    console.error(err)
    toast.error(t('common.unexpectedError'))
  } finally {
    loadingQuizzes.value = false
  }
}

// Récupère le quiz complet (avec correctIndex/explanation) uniquement à l'ouverture,
// pour ne jamais exposer les réponses dans la liste avant que l'utilisateur ne joue.
async function toggleQuiz(id: string) {
  if (openQuizId.value === id) {
    openQuizId.value = null
    openQuizData.value = null
    return
  }
  loadingQuizDetail.value = true
  try {
    const res = await api.get(`/flashcards/quiz/${id}`)
    openQuizData.value = res.data
    // incrémenter l'attempt pour forcer le remount de QuizPlayer
    quizAttempt[id] = (quizAttempt[id] ?? 0) + 1
    openQuizId.value = id
  } catch (err) {
    console.error(err)
    toast.error(t('common.unexpectedError'))
  } finally {
    loadingQuizDetail.value = false
  }
}

function onQuizCompleted(quiz: QuizData, score: number) {
  quiz.userScore = score
  // fermer automatiquement après 2 secondes
  setTimeout(() => {
    openQuizId.value = null
    openQuizData.value = null
  }, 2000)
}

async function removeQuiz(id: string) {
  try {
    await api.delete(`/flashcards/quiz/${id}`)
    allQuizzes.value = allQuizzes.value.filter(q => q._id !== id)
    if (openQuizId.value === id) openQuizId.value = null
  } catch (err) {
    console.error(err)
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function subjectName(id: string)  { return subjectsStore.subjects.find(s => s._id === id)?.name  ?? t('study.unknownModule') }
function subjectColor(id: string) { return subjectsStore.subjects.find(s => s._id === id)?.color ?? '#6366F1' }
function formatDate(d: string)    { return formatDateWithYear(d, locale.value) }

onMounted(async () => {
  await subjectsStore.fetchAll()
})
</script>