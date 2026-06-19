<template>
  <AppLayout title="Flashcards & Quiz">
    <div class="p-4 md:p-8 max-w-4xl mx-auto space-y-6">

      <!-- Generate form -->
      <div class="bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-2xl p-6 shadow-sm">
        <h2 class="font-display font-bold text-gray-900 dark:text-white mb-4">Générer des fiches</h2>

        <div class="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-xs font-mono font-bold uppercase text-gray-400 mb-2">Module</label>
            <select
              v-model="selectedSubjectId"
              class="w-full rounded-xl border border-gray-300 dark:border-ink-600 bg-white dark:bg-ink-900 text-gray-900 dark:text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
            >
              <option value="">Sélectionner un module</option>
              <option v-for="s in subjectsStore.subjects" :key="s._id" :value="s._id">{{ s.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-mono font-bold uppercase text-gray-400 mb-2">Texte du cours</label>
            <textarea
              v-model="inputText"
              rows="3"
              placeholder="Collez un extrait de cours ici..."
              class="w-full rounded-xl border border-gray-300 dark:border-ink-600 bg-white dark:bg-ink-900 text-gray-900 dark:text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition resize-none"
            />
          </div>
        </div>

        <div class="flex gap-3">
          <AppButton variant="primary" size="sm" :loading="generating" @click="generate('flashcards')">
            <template #icon-left><Layers :size="15" /></template>
            Générer flashcards
          </AppButton>
          <AppButton variant="outline" size="sm" :loading="generating" @click="generate('quiz')">
            <template #icon-left><HelpCircle :size="15" /></template>
            Générer quiz
          </AppButton>
        </div>
      </div>

      <!-- Flashcards -->
      <div v-if="flashcards.length > 0">
        <h3 class="font-display font-bold text-gray-900 dark:text-white mb-3">Flashcards ({{ flashcards.length }})</h3>
        <div class="grid sm:grid-cols-2 gap-3">
          <div
            v-for="(card, i) in flashcards"
            :key="i"
            class="bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-xl p-4 shadow-sm cursor-pointer hover:-translate-y-0.5 transition-all"
            @click="card.flipped = !card.flipped"
          >
            <div class="flex items-center gap-2 mb-2">
              <span class="font-mono text-[10px] text-gray-400 uppercase">{{ card.flipped ? 'Réponse' : 'Question' }}</span>
            </div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ card.flipped ? card.answer : card.question }}
            </p>
          </div>
        </div>
      </div>

      <!-- Quiz -->
      <div v-if="quiz">
        <h3 class="font-display font-bold text-gray-900 dark:text-white mb-3">Quiz</h3>
        <div class="space-y-4">
          <div
            v-for="(q, qi) in quiz.questions"
            :key="qi"
            class="bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-xl p-5 shadow-sm"
          >
            <p class="text-sm font-bold text-gray-900 dark:text-white mb-3">{{ qi + 1 }}. {{ q.question }}</p>
            <div class="space-y-2">
              <button
                v-for="(option, oi) in q.options"
                :key="oi"
                @click="selectAnswer(qi, oi)"
                class="w-full text-left px-4 py-2.5 rounded-lg text-sm border-2 transition-all"
                :class="getOptionClass(qi, oi, q.correctIndex)"
              >
                {{ option }}
              </button>
            </div>
            <p v-if="answers[qi] !== undefined && answers[qi] !== q.correctIndex" class="text-xs text-warm mt-2">
              {{ q.explanation }}
            </p>
          </div>
        </div>

        <div v-if="Object.keys(answers).length === quiz.questions.length" class="mt-4 text-center">
          <div class="inline-block bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-2xl px-8 py-5 shadow-sm">
            <p class="font-display text-3xl font-bold text-primary">{{ quizScore }}%</p>
            <p class="text-sm text-gray-500 mt-1">{{ correctCount }}/{{ quiz.questions.length }} correctes</p>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-if="flashcards.length === 0 && !quiz" class="text-center py-16">
        <div class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Layers :size="28" class="text-primary" />
        </div>
        <h3 class="font-display font-bold text-xl text-gray-900 dark:text-white mb-2">Aucune fiche générée</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">Sélectionnez un module, collez du texte et générez.</p>
      </div>

    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { Layers, HelpCircle } from '@lucide/vue'
import AppLayout from '@/shared/components/AppLayout.vue'
import AppButton from '@/shared/components/AppButton.vue'
import { useSubjectsStore } from '@/stores/subjects.store'
import api from '@/shared/utils/api'

const subjectsStore = useSubjectsStore()

const selectedSubjectId = ref('')
const inputText = ref('')
const generating = ref(false)

interface FlashcardUI { question: string; answer: string; flipped: boolean }
const flashcards = ref<FlashcardUI[]>([])

interface QuizUI { questions: { question: string; options: string[]; correctIndex: number; explanation: string }[] }
const quiz = ref<QuizUI | null>(null)
const answers = reactive<Record<number, number>>({})

const correctCount = computed(() => {
  if (!quiz.value) return 0
  return quiz.value.questions.filter((q, i) => answers[i] === q.correctIndex).length
})
const quizScore = computed(() => {
  if (!quiz.value) return 0
  return Math.round((correctCount.value / quiz.value.questions.length) * 100)
})

async function generate(type: 'flashcards' | 'quiz') {
  if (!selectedSubjectId.value || !inputText.value.trim()) return
  generating.value = true
  try {
    if (type === 'flashcards') {
      const res = await api.post('/flashcards/generate', {
        subjectId: selectedSubjectId.value,
        text: inputText.value
      })
      flashcards.value = res.data.map((f: any) => ({ ...f, flipped: false }))
      quiz.value = null
    } else {
      const res = await api.post('/flashcards/quiz/generate', {
        subjectId: selectedSubjectId.value,
        text: inputText.value
      })
      quiz.value = res.data
      flashcards.value = []
      Object.keys(answers).forEach(k => delete (answers as any)[k])
    }
  } catch (err) {
    console.error(err)
  } finally {
    generating.value = false
  }
}

function selectAnswer(qi: number, oi: number) {
  if (answers[qi] !== undefined) return
  answers[qi] = oi
}

function getOptionClass(qi: number, oi: number, correct: number): string {
  if (answers[qi] === undefined) return 'border-gray-200 dark:border-ink-600 text-gray-700 dark:text-gray-300 hover:border-primary'
  if (oi === correct) return 'border-secondary bg-secondary/10 text-secondary'
  if (answers[qi] === oi) return 'border-warm bg-warm/10 text-warm'
  return 'border-gray-100 dark:border-ink-700 text-gray-400'
}

onMounted(() => subjectsStore.fetchAll())
</script>
