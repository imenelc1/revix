<template>
  <div class="space-y-4">
    <div
      v-for="(q, qi) in quiz.questions"
      :key="qi"
      class="bg-gray-50 dark:bg-ink-900/60 border border-gray-100 dark:border-ink-700 rounded-xl p-5"
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

    <!-- Score final — affiché seulement après soumission réussie -->
    <div v-if="submitted" class="text-center pt-2">
      <div class="inline-block bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-2xl px-8 py-5 shadow-sm">
        <p v-if="submitting" class="text-sm text-gray-400 font-mono mb-2">{{ t('study.saving') }}</p>
        <template v-else>
          <p class="font-display text-3xl font-bold text-primary">{{ savedScore }}%</p>
         <p class="text-sm text-gray-500 mt-1">
            {{ correctCount }}/{{ quiz.questions.length }} {{ t('study.quizCorrect') }}
          </p>
          <AppButton variant="outline" size="sm" class="mt-3" @click="reset">
            {{ t('study.restart') }}
          </AppButton>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref, watch } from 'vue'
import AppButton from '@/shared/components/AppButton.vue'
import api from '@/shared/utils/api'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

interface Quiz {
  _id: string
  questions: QuizQuestion[]
  userScore?: number
}

const props = defineProps<{ quiz: Quiz }>()
const emit = defineEmits<{ completed: [score: number] }>()

const answers = reactive<Record<number, number>>({})
const submitted = ref(false)
const submitting = ref(false)
const savedScore = ref(0)

const correctCount = computed(() =>
  props.quiz.questions.filter((q, i) => answers[i] === q.correctIndex).length
)

const quizScore = computed(() =>
  Math.round((correctCount.value / props.quiz.questions.length) * 100)
)

// Dès que toutes les questions ont une réponse → soumettre à l'API
watch(
  () => Object.keys(answers).length,
  async (n) => {
    if (n !== props.quiz.questions.length || submitted.value) return
    submitted.value = true
    submitting.value = true
    try {
      const answersArray = props.quiz.questions.map((_, i) => answers[i])
      const res = await api.post(`/flashcards/quiz/${props.quiz._id}/submit`, {
        answers: answersArray
      })
      savedScore.value = res.data.score
      emit('completed', res.data.score)
    } catch {
      // fallback local si l'API échoue
      savedScore.value = quizScore.value
      emit('completed', quizScore.value)
    } finally {
      submitting.value = false
    }
  }
)

function selectAnswer(qi: number, oi: number) {
  if (answers[qi] !== undefined || submitted.value) return
  answers[qi] = oi
}

function getOptionClass(qi: number, oi: number, correct: number): string {
  if (answers[qi] === undefined)
    return 'border-gray-200 dark:border-ink-600 text-gray-700 dark:text-gray-300 hover:border-primary'
  if (oi === correct)
    return 'border-secondary bg-secondary/10 text-secondary'
  if (answers[qi] === oi)
    return 'border-warm bg-warm/10 text-warm'
  return 'border-gray-100 dark:border-ink-700 text-gray-400'
}

function reset() {
  Object.keys(answers).forEach(k => delete (answers as any)[k])
  submitted.value = false
  submitting.value = false
  savedScore.value = 0
}
</script>