<template>
  <AppLayout :title="t('sidebar.dashboard')" :score="readinessScore">
    <div class="p-4 md:p-8 max-w-6xl mx-auto space-y-6">

      <!-- Welcome banner -->
      <div class="bg-gradient-to-br from-primary to-[#4F52E8] rounded-2xl p-6 text-white relative overflow-hidden">
        <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 20px 20px;" />
        <div class="relative z-10">
          <p class="font-mono text-xs text-white/70 uppercase tracking-widest mb-1">{{ greeting }}</p>
          <h2 class="font-display text-2xl font-bold mb-1">{{ authStore.user?.firstName }} 👋</h2>
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
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-2xl p-4 shadow-sm"
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
      <div class="grid md:grid-cols-2 gap-6">

        <!-- Modules progress -->
        <div class="bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-2xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-5">
            <h3 class="font-display font-bold text-gray-900 dark:text-white">Modules</h3>
            <RouterLink to="/subjects" class="text-xs text-primary-soft hover:text-primary font-semibold transition">
              Voir tout →
            </RouterLink>
          </div>

          <div v-if="subjectsStore.loading" class="flex justify-center py-8">
            <AppSpinner size="md" />
          </div>

          <div v-else-if="subjectsStore.subjects.length === 0" class="text-center py-8">
            <p class="text-sm text-gray-400">Aucun module. <RouterLink to="/onboarding" class="text-primary-soft hover:text-primary font-semibold">Ajouter un module</RouterLink></p>
          </div>

          <div v-else class="space-y-4">
            <div v-for="subject in subjectsStore.subjects.slice(0, 5)" :key="subject._id">
              <div class="flex items-center justify-between mb-1.5">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ background: subject.color }"></span>
                  <span class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{ subject.name }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-xs text-gray-400 font-mono">{{ subject.chapters.length }} ch.</span>
                  <span class="text-xs font-semibold text-gray-900 dark:text-white">{{ subjectProgress(subject) }}%</span>
                </div>
              </div>
              <div class="h-1.5 bg-gray-100 dark:bg-ink-700 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :style="{ width: subjectProgress(subject) + '%', background: subject.color }"
                />
              </div>
              <div class="flex justify-between mt-1">
                <span class="text-[10px] font-mono text-gray-400">
                  Examen : {{ formatExamDate(subject.examDate) }}
                </span>
                <span
                  class="text-[10px] font-mono font-semibold"
                  :class="daysUntilExam(subject.examDate) <= 7 ? 'text-warm' : 'text-gray-400'"
                >
                  J-{{ daysUntilExam(subject.examDate) }}
                </span>
              </div>
            </div>
          </div>

          <RouterLink
            to="/onboarding"
            class="mt-4 flex items-center gap-2 w-full p-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-ink-600 text-sm text-gray-400 hover:border-primary hover:text-primary transition justify-center"
          >
            <Plus :size="16" /> Ajouter un module
          </RouterLink>
        </div>

        <!-- Upcoming sessions -->
        <div class="bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-2xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-5">
            <h3 class="font-display font-bold text-gray-900 dark:text-white">Sessions à venir</h3>
            <RouterLink to="/planning" class="text-xs text-primary-soft hover:text-primary font-semibold transition">
              Voir planning →
            </RouterLink>
          </div>

          <div v-if="!planningStore.planning" class="text-center py-8">
            <div class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <CalendarDays :size="20" class="text-primary" />
            </div>
            <p class="text-sm text-gray-400 mb-3">Aucun planning généré</p>
            <RouterLink to="/planning">
              <AppButton variant="primary" size="sm">
                <template #icon-left><Sparkles :size="14" /></template>
                Générer mon planning
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
              Aucune session à venir cette semaine
            </div>
          </div>
        </div>
      </div>

      <!-- Heatmap placeholder -->
      <div class="bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-2xl p-6 shadow-sm">
        <h3 class="font-display font-bold text-gray-900 dark:text-white mb-5">Activité des 4 dernières semaines</h3>
        <div class="grid grid-cols-28 gap-1">
          <div
            v-for="(day, i) in heatmapDays"
            :key="i"
            class="w-4 h-4 rounded-sm transition-all hover:scale-125"
            :class="day === 0 ? 'bg-gray-100 dark:bg-ink-700'
              : day === 1 ? 'bg-primary/30'
              : day === 2 ? 'bg-primary/60'
              : 'bg-primary'"
            :title="`${day} session(s)`"
          />
        </div>
        <div class="flex items-center gap-2 mt-3">
          <span class="text-xs text-gray-400">Moins</span>
          <div class="flex gap-1">
            <div v-for="n in 4" :key="n" class="w-3 h-3 rounded-sm"
              :class="['bg-gray-100 dark:bg-ink-700', 'bg-primary/30', 'bg-primary/60', 'bg-primary'][n-1]" />
          </div>
          <span class="text-xs text-gray-400">Plus</span>
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
  BookOpen, CalendarDays, CheckCircle, TrendingUp, Plus, Sparkles
} from '@lucide/vue'
import AppLayout from '@/shared/components/AppLayout.vue'
import AppButton from '@/shared/components/AppButton.vue'
import AppSpinner from '@/shared/components/AppSpinner.vue'
import { useAuthStore } from '@/stores/auth.store'
import { useSubjectsStore } from '@/stores/subjects.store'
import { usePlanningStore } from '@/stores/planning.store'
import type { Subject } from '@/stores/subjects.store'

const { t } = useI18n()
const authStore = useAuthStore()
const subjectsStore = useSubjectsStore()
const planningStore = usePlanningStore()

// ── Greeting ──────────────────────────────────────────────────────────────────
const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Bonjour'
  if (h < 18) return 'Bon après-midi'
  return 'Bonsoir'
})

const todaySummary = computed(() => {
  const upcoming = upcomingSessions.value.length
  if (upcoming === 0) return 'Aucune session planifiée aujourd\'hui.'
  return `${upcoming} session${upcoming > 1 ? 's' : ''} planifiée${upcoming > 1 ? 's' : ''} aujourd\'hui.`
})

// ── Stats ──────────────────────────────────────────────────────────────────────
const readinessScore = computed(() => planningStore.planning?.overallReadinessScore ?? 0)

const stats = computed(() => [
  {
    label: 'Modules',
    value: subjectsStore.subjects.length,
    icon: BookOpen,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary-soft',
    trend: '+' + subjectsStore.subjects.length,
    trendColor: 'text-primary-soft'
  },
  {
    label: 'Chapitres total',
    value: subjectsStore.subjects.reduce((s, m) => s + m.chapters.length, 0),
    icon: CheckCircle,
    iconBg: 'bg-secondary/10',
    iconColor: 'text-secondary',
    trend: '',
    trendColor: ''
  },
  {
    label: 'Sessions terminées',
    value: planningStore.planning?.sessions.filter(s => s.status === 'completed').length ?? 0,
    icon: TrendingUp,
    iconBg: 'bg-teal/10',
    iconColor: 'text-teal',
    trend: '',
    trendColor: ''
  },
  {
    label: 'Score global',
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
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
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
  return new Date(dateStr).toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: 'short' })
}

// ── Heatmap ────────────────────────────────────────────────────────────────────
const heatmapDays = computed(() => {
  const days: number[] = Array(28).fill(0)
  if (!planningStore.planning) return days
  const now = new Date()
  planningStore.planning.sessions.forEach(s => {
    const diff = Math.floor((now.getTime() - new Date(s.date).getTime()) / (1000 * 60 * 60 * 24))
    if (diff >= 0 && diff < 28) {
      const idx = 27 - diff
      if (s.status === 'completed') days[idx] = Math.min(3, days[idx] + 1)
    }
  })
  return days
})

// ── Init ───────────────────────────────────────────────────────────────────────
onMounted(async () => {
  await subjectsStore.fetchAll()
  await planningStore.fetch()
})
</script>
