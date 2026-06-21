<template>
  <AppLayout :title="t('calendar.title')" :subtitle="t('calendar.subtitle')">
    <div class="p-4 md:p-8 max-w-6xl mx-auto space-y-6">

      <!-- Empty state -->
      <div
        v-if="!planningStore.planning && !planningStore.loading"
        class="bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-2xl p-16 text-center shadow-sm"
      >
        <div class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <CalendarDays :size="28" class="text-primary" />
        </div>
        <h3 class="font-display font-bold text-xl text-gray-900 dark:text-white mb-2">{{ t('planning.noPlanning') }}</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-5">{{ t('planning.noPlanningDesc') }}</p>
        <RouterLink to="/planning">
          <AppButton variant="primary" size="md">
            <template #icon-left><Sparkles :size="16" /></template>
            {{ t('planning.generate') }}
          </AppButton>
        </RouterLink>
      </div>

      <template v-else>

        <!-- Header: navigation mois -->
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <button @click="prevMonth" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-ink-700 transition text-gray-500 dark:text-gray-400">
              <ChevronLeft :size="18" />
            </button>
            <h2 class="font-display text-lg font-bold text-gray-900 dark:text-white capitalize min-w-[160px] text-center">
              {{ monthLabel }}
            </h2>
            <button @click="nextMonth" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-ink-700 transition text-gray-500 dark:text-gray-400">
              <ChevronRight :size="18" />
            </button>
          </div>

          <button
            @click="goToday"
            class="px-3 py-1.5 rounded-lg text-sm font-semibold border-2 border-gray-200 dark:border-ink-600 text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary transition"
          >
            {{ t('calendar.today') }}
          </button>
        </div>

        <!-- Stats du mois -->
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-xl p-4 text-center shadow-sm">
            <p class="font-display text-xl font-bold text-gray-900 dark:text-white">{{ monthStats.total }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ t('planning.totalSessions') }}</p>
          </div>
          <div class="bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-xl p-4 text-center shadow-sm">
            <p class="font-display text-xl font-bold text-secondary">{{ monthStats.completed }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ t('planning.completedSessions') }}</p>
          </div>
          <div class="bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-xl p-4 text-center shadow-sm">
            <p class="font-display text-xl font-bold text-warm">{{ monthStats.missed }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ t('planning.missedSessions') }}</p>
          </div>
        </div>

        <!-- Grille calendrier -->
        <div class="bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-2xl shadow-sm overflow-hidden">

          <div class="grid grid-cols-7 border-b border-surface-border dark:border-ink-700">
            <div
              v-for="d in weekDayLabels"
              :key="d"
              class="py-2.5 text-center font-mono text-[11px] uppercase tracking-wide text-gray-400 dark:text-ink-600"
            >
              {{ d }}
            </div>
          </div>

          <div class="grid grid-cols-7">
            <button
              v-for="cell in calendarDays"
              :key="cell.key"
              @click="selectedDayKey = cell.key"
              class="relative w-full aspect-square sm:aspect-[4/3] border-b border-r border-surface-border dark:border-ink-700 p-1.5 sm:p-2 flex flex-col items-start gap-1 text-left transition-colors"
              :class="[
                cell.isCurrentMonth ? 'bg-white dark:bg-ink-800' : 'bg-gray-50/60 dark:bg-ink-900/40',
                selectedDayKey === cell.key ? 'ring-2 ring-inset ring-primary' : 'hover:bg-gray-50 dark:hover:bg-ink-700/50'
              ]"
            >
              <span
                class="text-xs font-mono font-semibold w-6 h-6 flex items-center justify-center rounded-full"
                :class="[
                  cell.isToday ? 'bg-primary text-white' : cell.isCurrentMonth ? 'text-gray-700 dark:text-gray-300' : 'text-gray-300 dark:text-ink-600'
                ]"
              >
                {{ cell.day }}
              </span>

              <span
                v-if="cell.exams.length > 0"
                :title="`${t('calendar.examBadge')} : ${cell.exams.map(e => e.name).join(', ')}`"
                class="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 text-warm"
              >
                <GraduationCap :size="13" />
              </span>

              <div class="flex flex-wrap gap-1 mt-auto">
                <span
                  v-for="session in cell.sessions.slice(0, 4)"
                  :key="session._id"
                  class="w-1.5 h-1.5 rounded-full"
                  :class="session.status === 'missed' ? 'opacity-40' : ''"
                  :style="{ background: session.subjectColor }"
                />
                <span v-if="cell.sessions.length > 4" class="text-[9px] font-mono text-gray-400">
                  +{{ cell.sessions.length - 4 }}
                </span>
              </div>
            </button>
          </div>
        </div>

        <!-- Légende -->
        <div v-if="subjectsStore.subjects.length > 0" class="flex flex-wrap items-center gap-4 px-1">
          <span class="text-xs font-mono uppercase text-gray-400">{{ t('calendar.legend') }}</span>
          <div v-for="subject in subjectsStore.subjects" :key="subject._id" class="flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full" :style="{ background: subject.color }" />
            <span class="text-xs text-gray-600 dark:text-gray-300">{{ subject.name }}</span>
          </div>
        </div>

        <!-- Détail du jour sélectionné -->
        <div class="bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-2xl shadow-sm overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-surface-border dark:border-ink-700">
            <span class="font-display font-bold text-gray-900 dark:text-white text-sm capitalize">{{ formattedSelectedDay }}</span>
            <span v-if="selectedDayExams.length" class="flex items-center gap-1.5 text-xs font-semibold text-warm">
              <GraduationCap :size="13" />
              {{ t('calendar.examBadge') }} : {{ selectedDayExams.map(e => e.name).join(', ') }}
            </span>
          </div>

          <div class="divide-y divide-gray-100 dark:divide-ink-700">
            <div v-if="selectedDaySessions.length === 0" class="py-12 text-center text-sm text-gray-400">
              {{ t('calendar.noSessionsDay') }}
            </div>

            <div
              v-for="session in selectedDaySessions"
              :key="session._id"
              class="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-ink-700/50 transition group"
            >
              <div class="w-2 h-10 rounded-full shrink-0" :style="{ background: session.subjectColor }"></div>

              <div class="min-w-[90px] shrink-0">
                <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ session.startTime }} – {{ session.endTime }}</p>
                <p class="text-[11px] font-mono text-gray-400">{{ session.durationMinutes }} {{ t('planning.min') }}</p>
              </div>

              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-gray-900 dark:text-white truncate">{{ session.subjectName }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ session.chapterTitle }}</p>
              </div>

              <div class="shrink-0">
                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
                  :class="statusClass(session.status)"
                >
                  <component :is="statusIcon(session.status)" :size="12" />
                  {{ statusLabel(session.status) }}
                </span>
              </div>

              <div class="shrink-0 flex gap-1.5 opacity-0 group-hover:opacity-100 transition">
                <button
                  v-if="session.status === 'planned'"
                  @click="markStatus(session._id, 'completed')"
                  class="p-1.5 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20 transition"
                  :title="t('planning.markCompleted')"
                >
                  <Check :size="14" />
                </button>
                <button
                  v-if="session.status === 'planned'"
                  @click="markStatus(session._id, 'missed')"
                  class="p-1.5 rounded-lg bg-warm/10 text-warm hover:bg-warm/20 transition"
                  :title="t('planning.markMissed')"
                >
                  <X :size="14" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </template>

    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  ChevronLeft, ChevronRight, CalendarDays, GraduationCap,
  Check, X, RefreshCw, Calendar, Sparkles
} from '@lucide/vue'
import AppLayout from '@/shared/components/AppLayout.vue'
import AppButton from '@/shared/components/AppButton.vue'
import { usePlanningStore } from '@/stores/planning.store'
import { useSubjectsStore } from '@/stores/subjects.store'
import type { Session } from '@/stores/planning.store'

const { t, locale } = useI18n()
const planningStore = usePlanningStore()
const subjectsStore = useSubjectsStore()

// ── Helpers date (clé locale YYYY-MM-DD, pas de décalage UTC) ─────────────────
function dateKey(d: Date | string): string {
  const date = typeof d === 'string' ? new Date(d) : d
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1) }

// ── Mois affiché ───────────────────────────────────────────────────────────────
const currentMonth = ref(startOfMonth(new Date()))
const selectedDayKey = ref(dateKey(new Date()))

function prevMonth() {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() - 1, 1)
}
function nextMonth() {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1, 1)
}
function goToday() {
  currentMonth.value = startOfMonth(new Date())
  selectedDayKey.value = dateKey(new Date())
}

const monthLabel = computed(() =>
  currentMonth.value.toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : 'en-US', { month: 'long', year: 'numeric' })
)

const weekDayLabels = computed(() => [
  t('planning.monday'), t('planning.tuesday'), t('planning.wednesday'),
  t('planning.thursday'), t('planning.friday'), t('planning.saturday'), t('planning.sunday')
])

// ── Grille du mois (lundi en premier) ──────────────────────────────────────────
const rawDays = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  const firstOfMonth = new Date(year, month, 1)
  const startOffset = (firstOfMonth.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7
  const days: Date[] = []
  for (let i = 0; i < totalCells; i++) {
    days.push(new Date(year, month, i - startOffset + 1))
  }
  return days
})

// ── Sessions et examens groupés par jour ───────────────────────────────────────
const sessionsByDate = computed(() => {
  const map: Record<string, Session[]> = {}
  if (!planningStore.planning) return map
  for (const s of planningStore.planning.sessions) {
    const key = dateKey(s.date)
    if (!map[key]) map[key] = []
    map[key].push(s)
  }
  for (const key in map) {
    map[key].sort((a, b) => a.startTime.localeCompare(b.startTime))
  }
  return map
})

const examsByDate = computed(() => {
  const map: Record<string, { name: string; color: string }[]> = {}
  for (const s of subjectsStore.subjects) {
    const key = dateKey(s.examDate)
    if (!map[key]) map[key] = []
    map[key].push({ name: s.name, color: s.color })
  }
  return map
})

const todayKey = computed(() => dateKey(new Date()))

const calendarDays = computed(() => {
  return rawDays.value.map(date => {
    const key = dateKey(date)
    return {
      date,
      key,
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === currentMonth.value.getMonth(),
      isToday: key === todayKey.value,
      sessions: sessionsByDate.value[key] || [],
      exams: examsByDate.value[key] || []
    }
  })
})

// ── Stats du mois affiché ──────────────────────────────────────────────────────
const monthStats = computed(() => {
  const sessions = calendarDays.value
    .filter(c => c.isCurrentMonth)
    .flatMap(c => c.sessions)
  return {
    total: sessions.length,
    completed: sessions.filter(s => s.status === 'completed').length,
    missed: sessions.filter(s => s.status === 'missed').length
  }
})

// ── Jour sélectionné ────────────────────────────────────────────────────────────
const selectedDaySessions = computed(() => sessionsByDate.value[selectedDayKey.value] || [])
const selectedDayExams = computed(() => examsByDate.value[selectedDayKey.value] || [])

const formattedSelectedDay = computed(() => {
  const [y, m, d] = selectedDayKey.value.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
    weekday: 'long', day: 'numeric', month: 'long'
  })
})

// ── Statuts ─────────────────────────────────────────────────────────────────────
function statusClass(status: Session['status']) {
  return {
    planned:     'bg-primary/10 text-primary-soft',
    completed:   'bg-secondary/10 text-secondary',
    missed:      'bg-warm/10 text-warm',
    rescheduled: 'bg-accent/10 text-accent'
  }[status]
}
function statusIcon(status: Session['status']) {
  return { planned: Calendar, completed: Check, missed: X, rescheduled: RefreshCw }[status]
}
function statusLabel(status: Session['status']) {
  return {
    planned:     t('planning.sessionPlanned'),
    completed:   t('planning.sessionCompleted'),
    missed:      t('planning.sessionMissed'),
    rescheduled: t('planning.sessionRescheduled')
  }[status]
}

async function markStatus(sessionId: string, status: 'completed' | 'missed') {
  await planningStore.updateStatus(sessionId, status)
}

// ── Init ────────────────────────────────────────────────────────────────────────
onMounted(async () => {
  await subjectsStore.fetchAll()
  await planningStore.fetch()
})
</script>