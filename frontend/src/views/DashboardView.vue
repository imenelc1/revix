<template>
  <AppLayout :title="t('sidebar.dashboard')" :score="readinessScore">
    <div class="p-4 md:p-8 max-w-6xl mx-auto space-y-6 overflow-x-hidden">

      <!-- Welcome banner -->
      <div class="bg-gradient-to-br from-primary to-[#4F52E8] rounded-2xl p-5 md:p-6 text-white relative overflow-hidden">
        <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 20px 20px;" />
        <div class="relative z-10">
          <p class="font-mono text-xs text-white/70 uppercase tracking-widest mb-1">{{ greeting }}</p>
          <h2 class="font-display text-xl md:text-2xl font-bold mb-1 break-words">
            {{ authStore.user?.firstName }}
          </h2>
          <p class="text-white/80 text-sm">{{ todaySummary }}</p>
        </div>
        <div class="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-2">
          <div class="bg-white/10 rounded-xl px-4 py-3 text-center">
            <p class="font-display text-3xl font-bold">{{ readinessScore }}%</p>
            <p class="text-xs text-white/70 font-mono">{{ t('planning.readinessScore') }}</p>
          </div>
        </div>
      </div>

      <!-- Stats row -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-2xl p-4 shadow-sm min-w-0"
        >
          <div class="flex items-center justify-between mb-3">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="stat.iconBg">
              <component :is="stat.icon" :size="16" :class="stat.iconColor" />
            </div>
            <span class="font-mono text-xs" :class="stat.trendColor">{{ stat.trend }}</span>
          </div>
          <p class="font-display text-2xl font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ stat.label }}</p>
        </div>
      </div>

      <!-- Main grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- Modules progress -->
        <div class="bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-2xl p-5 md:p-6 shadow-sm min-w-0">
          <div class="flex items-center justify-between gap-3 mb-5">
            <h3 class="font-display font-bold text-gray-900 dark:text-white">{{ t('dashboard.modules') }}</h3>
            <RouterLink to="/subjects" class="text-xs text-primary-soft hover:text-primary font-semibold transition">
              {{ t('dashboard.viewAll') }}
            </RouterLink>
          </div>

          <div v-if="subjectsStore.loading" class="flex justify-center py-8">
            <AppSpinner size="md" />
          </div>

          <div v-else-if="subjectsStore.subjects.length === 0" class="text-center py-8">
            <p class="text-sm text-gray-400">{{ t('dashboard.noModules') }} <RouterLink to="/onboarding" class="text-primary-soft hover:text-primary font-semibold">{{ t('dashboard.addModule') }}</RouterLink></p>
          </div>

          <div v-else class="space-y-4">
            <div v-for="subject in subjectsStore.subjects.slice(0, 5)" :key="subject._id">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 mb-1.5">
                <div class="flex items-center gap-2 min-w-0">
                  <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ background: subject.color }"></span>
                  <span class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{ subject.name }}</span>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <span class="text-xs text-gray-400 font-mono">{{ subject.chapters.length }} {{ t('dashboard.chapters') }}</span>
                  <span class="text-xs font-semibold text-gray-900 dark:text-white">{{ subjectProgress(subject) }}%</span>
                </div>
              </div>
              <div class="h-1.5 bg-gray-100 dark:bg-ink-700 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :style="{ width: subjectProgress(subject) + '%', background: subject.color }"
                />
              </div>
              <div class="flex flex-col sm:flex-row sm:justify-between gap-1 mt-1">
                <span class="text-[10px] font-mono text-gray-400">
                  {{ t('dashboard.exam') }} : {{ formatExamDate(subject.examDate) }}
                </span>
                <span
                  class="text-[10px] font-mono font-semibold"
                  :class="daysUntilExam(subject.examDate) <= 7 ? 'text-warm' : 'text-gray-400'"
                >
                  {{ t('dashboard.daysRemaining', { days: daysUntilExam(subject.examDate) }) }}
                </span>
              </div>
            </div>
          </div>

          <RouterLink
            to="/onboarding"
            class="mt-4 flex items-center gap-2 w-full p-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-ink-600 text-sm text-gray-400 hover:border-primary hover:text-primary transition justify-center"
          >
            <Plus :size="16" /> {{ t('dashboard.addModule') }}
          </RouterLink>
        </div>

        <!-- Upcoming sessions -->
        <div class="bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-2xl p-5 md:p-6 shadow-sm min-w-0">
          <div class="flex items-center justify-between gap-3 mb-5">
            <h3 class="font-display font-bold text-gray-900 dark:text-white">{{ t('dashboard.upcomingSessions') }}</h3>
            <RouterLink to="/planning" class="text-xs text-primary-soft hover:text-primary font-semibold transition">
              {{ t('dashboard.viewPlanning') }} 
            </RouterLink>
          </div>

          <div v-if="!planningStore.planning" class="text-center py-8">
            <div class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <CalendarDays :size="20" class="text-primary" />
            </div>
            <p class="text-sm text-gray-400 mb-3">{{ t('dashboard.noPlanning') }}</p>
            <RouterLink to="/planning">
              <AppButton variant="primary" size="sm">
                <template #icon-left><Sparkles :size="14" /></template>
                {{ t('dashboard.generatePlanning') }}
              </AppButton>
            </RouterLink>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="session in upcomingSessions"
              :key="session._id"
              class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-ink-900/60 border border-gray-100 dark:border-ink-700"
            >
              <div class="w-1.5 h-10 rounded-full shrink-0" :style="{ background: session.subjectColor }"></div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{ session.subjectName }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ session.chapterTitle }}</p>
              </div>
              <div class="text-right shrink-0">
                <p class="text-xs font-mono text-gray-900 dark:text-white">{{ session.startTime }}</p>
                <p class="text-[10px] text-gray-400 font-mono">{{ formatDate(session.date) }}</p>
              </div>
            </div>

            <div v-if="upcomingSessions.length === 0" class="text-center py-4 text-sm text-gray-400">
              {{ t('dashboard.noUpcomingSessions') }}
            </div>
          </div>
        </div>
      </div>

      <!-- Heatmap placeholder -->
     <!-- Chapitres prioritaires à réviser -->
<div class="bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-2xl p-5 md:p-6 shadow-sm min-w-0">
  <div class="flex items-center justify-between gap-3 mb-5">
    <h3 class="font-display font-bold text-gray-900 dark:text-white">{{ t('dashboard.priorityTitle') }}</h3>
    <RouterLink to="/subjects" class="text-xs text-primary-soft hover:text-primary font-semibold transition">
      {{ t('dashboard.viewAll') }}
    </RouterLink>
  </div>

  <div v-if="priorityChapters.length === 0" class="text-center py-8">
    <div class="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center mx-auto mb-3">
      <CheckCircle :size="20" class="text-secondary" />
    </div>
    <p class="text-sm text-gray-400">{{ t('dashboard.priorityEmpty') }}</p>
  </div>

  <div v-else class="space-y-2">
    <div
      v-for="(item, i) in priorityChapters"
      :key="i"
      class="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-ink-900/60 border border-gray-100 dark:border-ink-700"
    >
      <component
        :is="item.masteryLevel === 'not_understood' ? XCircle : HelpCircle"
        :size="16"
        :class="item.masteryLevel === 'not_understood' ? 'text-warm' : 'text-accent'"
        class="shrink-0"
      />
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{ item.chapterTitle }}</p>
        <div class="flex items-center gap-1.5 mt-0.5">
          <span class="w-1.5 h-1.5 rounded-full shrink-0" :style="{ background: item.subjectColor }"></span>
          <span class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ item.subjectName }}</span>
        </div>
      </div>
      <span
        class="shrink-0 text-[11px] font-mono font-semibold px-2 py-1 rounded-lg w-fit"
        :class="item.daysUntilExam <= 7 ? 'bg-warm/10 text-warm' : 'bg-gray-100 dark:bg-ink-700 text-gray-500 dark:text-gray-400'"
      >
        {{ t('dashboard.daysRemaining', { days: item.daysUntilExam }) }}
      </span>
    </div>
  </div>
</div>

    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  BookOpen, CalendarDays, CheckCircle, TrendingUp, Plus, Sparkles,
  XCircle, HelpCircle
} from '@lucide/vue'
import AppLayout from '@/shared/components/AppLayout.vue'
import AppButton from '@/shared/components/AppButton.vue'
import AppSpinner from '@/shared/components/AppSpinner.vue'
import { useAuthStore } from '@/stores/auth.store'
import { useSubjectsStore } from '@/stores/subjects.store'
import { usePlanningStore } from '@/stores/planning.store'
import type { Subject } from '@/stores/subjects.store'
import { formatShortDate, formatWeekdayShortDate } from '@/shared/utils/dates'
const { t, locale } = useI18n()
const authStore = useAuthStore()
const subjectsStore = useSubjectsStore()
const planningStore = usePlanningStore()

// ── Greeting ──────────────────────────────────────────────────────────────────
const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return t('dashboard.greetingMorning')
  if (h < 18) return t('dashboard.greetingAfternoon')
  return t('dashboard.greetingEvening')
})

const todaySummary = computed(() => {
  const upcoming = upcomingSessions.value.length
  if (upcoming === 0) return t('dashboard.noUpcomingSessions')
  return t('dashboard.todaySessions', { count: upcoming })
})

// ── Stats ──────────────────────────────────────────────────────────────────────
const readinessScore = computed(() => planningStore.planning?.overallReadinessScore ?? 0)

const stats = computed(() => [
  {
    label: t('dashboard.modules'),
    value: subjectsStore.subjects.length,
    icon: BookOpen,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary-soft',
    trend: '+' + subjectsStore.subjects.length,
    trendColor: 'text-primary-soft'
  },
  {
    label: t('dashboard.totalChapters'),
    value: subjectsStore.subjects.reduce((s, m) => s + m.chapters.length, 0),
    icon: CheckCircle,
    iconBg: 'bg-secondary/10',
    iconColor: 'text-secondary',
    trend: '',
    trendColor: ''
  },
  {
    label: t('dashboard.completedSessions'),
    value: planningStore.planning?.sessions.filter(s => s.status === 'completed').length ?? 0,
    icon: TrendingUp,
    iconBg: 'bg-teal/10',
    iconColor: 'text-teal',
    trend: '',
    trendColor: ''
  },
  {
    label: t('dashboard.globalScore'),
    value: readinessScore.value + '%',
    icon: CalendarDays,
    iconBg: 'bg-warm/10',
    iconColor: 'text-warm',
    trend: '',
    trendColor: ''
  }
])

// ── Subjects helpers ───────────────────────────────────────────────────────────
function subjectProgress(subject: Subject): number {
  if (subject.chapters.length === 0) return 0
  const mastered = subject.chapters.filter(c => c.masteryLevel === 'mastered').length
  return Math.round((mastered / subject.chapters.length) * 100)
}

function formatExamDate(date: string): string {
  return formatShortDate(date, locale.value)
}

function daysUntilExam(date: string): number {
  const diff = new Date(date).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

// ── Upcoming sessions ──────────────────────────────────────────────────────────
const upcomingSessions = computed(() => {
  if (!planningStore.planning) return []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return planningStore.planning.sessions
    .filter(s => s.status === 'planned' && new Date(s.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)
})

function formatDate(dateStr: string): string {
  return formatWeekdayShortDate(dateStr, locale.value)
}
// ── Heatmap ────────────────────────────────────────────────────────────────────
interface PriorityChapter {
  subjectName: string
  subjectColor: string
  chapterTitle: string
  masteryLevel: string
  daysUntilExam: number
}

const priorityChapters = computed<PriorityChapter[]>(() => {
  const items: PriorityChapter[] = []
  for (const subject of subjectsStore.subjects) {
    const days = daysUntilExam(subject.examDate)
    for (const chapter of subject.chapters) {
      if (chapter.masteryLevel === 'mastered') continue
      items.push({
        subjectName: subject.name,
        subjectColor: subject.color,
        chapterTitle: chapter.title,
        masteryLevel: chapter.masteryLevel,
        daysUntilExam: days
      })
    }
  }
  return items
    .sort((a, b) => {
      if (a.masteryLevel !== b.masteryLevel) {
        return a.masteryLevel === 'not_understood' ? -1 : 1
      }
      return a.daysUntilExam - b.daysUntilExam
    })
    .slice(0, 5)
})
// ── Init ───────────────────────────────────────────────────────────────────────
onMounted(async () => {
  await subjectsStore.fetchAll()
  await planningStore.fetch()
})
</script>
