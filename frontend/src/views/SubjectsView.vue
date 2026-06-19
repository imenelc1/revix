<template>
  <AppLayout :title="t('sidebar.modules')">
    <div class="p-4 md:p-8 max-w-5xl mx-auto space-y-6">

      <!-- Header actions -->
      <div class="flex items-center justify-between">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ t('subjects.count', { count: subjectsStore.subjects.length }) }}
        </p>
        <RouterLink to="/onboarding">
          <AppButton variant="primary" size="sm">
            <template #icon-left><Plus :size="16" /></template>
            {{ t('subjects.addModule') }}
          </AppButton>
        </RouterLink>
      </div>

      <!-- Loading -->
      <div v-if="subjectsStore.loading" class="flex justify-center py-20">
        <AppSpinner size="lg" />
      </div>

      <!-- Empty -->
      <div v-else-if="subjectsStore.subjects.length === 0" class="text-center py-20">
        <div class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <BookOpen :size="28" class="text-primary" />
        </div>
        <h3 class="font-display font-bold text-xl text-gray-900 dark:text-white mb-2">{{ t('subjects.emptyTitle') }}</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-5">{{ t('subjects.emptyDescription') }}</p>
        <RouterLink to="/onboarding">
          <AppButton variant="primary" size="md">
            <template #icon-left><Plus :size="16" /></template>
            {{ t('subjects.addModule') }}
          </AppButton>
        </RouterLink>
      </div>

      <!-- Subjects grid -->
      <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="subject in subjectsStore.subjects"
          :key="subject._id"
          class="bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
        >
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-display font-bold text-sm"
                :style="{ background: subject.color }">
                {{ subject.name.charAt(0).toUpperCase() }}
              </div>
              <div>
                <h4 class="font-display font-bold text-gray-900 dark:text-white text-sm">{{ subject.name }}</h4>
               <p class="text-xs text-gray-400 font-mono">
                  {{ t('subjects.daysRemaining', { days: daysUntilExam(subject.examDate) }) }}
                </p>
              </div>
            </div>
            <button
              @click="confirmDelete(subject._id)"
              class="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
            >
              <Trash2 :size="15" />
            </button>
          </div>

          <!-- Progress -->
          <div class="mb-3">
            <div class="flex justify-between text-xs mb-1.5">
              <span class="text-gray-500 dark:text-gray-400">{{ t('subjects.chapters', { count: subject.chapters.length }) }}</span>
              <span class="font-semibold text-gray-900 dark:text-white">{{ subjectProgress(subject) }}%</span>
            </div>
            <div class="h-1.5 bg-gray-100 dark:bg-ink-700 rounded-full overflow-hidden">
              <div class="h-full rounded-full transition-all duration-500"
                :style="{ width: subjectProgress(subject) + '%', background: subject.color }" />
            </div>
          </div>

          <!-- Chapters list -->
          <div class="space-y-1.5">
            <div
              v-for="chapter in subject.chapters.slice(0, 3)"
              :key="chapter._id"
              class="flex items-center gap-2 text-xs"
            >
              <component 
              :is="masteryStatus(chapter.masteryLevel).icon" 
              :size="14" 
              class="shrink-0"
              :class="masteryStatus(chapter.masteryLevel).class"
            />
              <span class="truncate text-gray-600 dark:text-gray-400">{{ chapter.title }}</span>
              <span class="truncate text-gray-600 dark:text-gray-400">{{ chapter.title }}</span>
            </div>
            <p v-if="subject.chapters.length > 3" class="text-xs text-gray-400 pl-4">
              {{ t('subjects.moreChapters', { count: subject.chapters.length - 3 }) }}
            </p>
          </div>

          <!-- Exam date -->
          <div class="mt-4 pt-3 border-t border-gray-100 dark:border-ink-700 flex items-center justify-between">
            <span class="text-xs text-gray-400 font-mono">
              {{ t('subjects.exam') }}: {{ formatExamDate(subject.examDate) }}
            </span>
            <span
              class="text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 w-fit"
              :class="riskInfo(subject.examDate).class"
            >
              <component
                :is="riskInfo(subject.examDate).icon"
                :size="12"
              />

              {{ riskInfo(subject.examDate).label }}
            </span>
          </div>
        </div>
      </div>

    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Plus, Trash2, BookOpen, AlertCircle, Clock3, CheckCircle2, XCircle, HelpCircle, CheckCircle } from '@lucide/vue'
import AppLayout from '@/shared/components/AppLayout.vue'
import AppButton from '@/shared/components/AppButton.vue'
import AppSpinner from '@/shared/components/AppSpinner.vue'
import { useSubjectsStore } from '@/stores/subjects.store'
import type { Subject } from '@/stores/subjects.store'


const { t } = useI18n()
const subjectsStore = useSubjectsStore()

function subjectProgress(subject: Subject): number {
  if (!subject.chapters.length) return 0
  const mastered = subject.chapters.filter(c => c.masteryLevel === 'mastered').length
  return Math.round((mastered / subject.chapters.length) * 100)
}

function masteryStatus(level: string) {
  const statusMap: Record<string, { icon: any; class: string }> = {
    not_understood: { icon: XCircle, class: 'text-warm' },     
    average: { icon: HelpCircle, class: 'text-accent' },      
    mastered: { icon: CheckCircle, class: 'text-secondary' }
  }
  
  // Valeur par défaut si le niveau n'est pas reconnu
  return statusMap[level] ?? { icon: HelpCircle, class: 'text-gray-400' }
}

function formatExamDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function daysUntilExam(date: string): number {
  return Math.max(0, Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
}

const riskInfo = (date: string) => {
  const d = daysUntilExam(date)

  if (d <= 7) {
    return {
      label: t('subjects.urgent'),
      icon: AlertCircle,
      class: 'bg-warm/10 text-warm'
    }
  }

  if (d <= 14) {
    return {
      label: t('subjects.soon'),
      icon: Clock3,
      class: 'bg-accent/10 text-accent'
    }
  }

  return {
    label: t('subjects.ok'),
    icon: CheckCircle2,
    class: 'bg-secondary/10 text-secondary'
  }
}

async function confirmDelete(id: string) {
  if (confirm(t('subjects.deleteConfirm'))) {
    await subjectsStore.remove(id)
  }
}

onMounted(() => subjectsStore.fetchAll())
</script>
