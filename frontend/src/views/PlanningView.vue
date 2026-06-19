<template>
  <AppLayout :title="t('planning.title')" :subtitle="t('planning.subtitle')">
    <div class="p-4 md:p-8 max-w-5xl mx-auto space-y-6">

      <!-- ── Config + Stats ── -->
      <div class="grid md:grid-cols-3 gap-4">

        <!-- Config card -->
        <div class="md:col-span-2 bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-2xl p-6 shadow-sm">
          <h2 class="font-display font-bold text-base text-gray-900 dark:text-white mb-5">
            {{ t('planning.availableDays') }}
          </h2>

          <!-- Jours -->
          <div class="flex flex-wrap gap-2 mb-5">
            <button
              v-for="(day, i) in weekDays"
              :key="i"
              @click="toggleDay(i + 1)"
              class="px-3 py-1.5 rounded-lg text-sm font-semibold border-2 transition-all duration-200"
              :class="config.availableDays.includes(i + 1)
                ? 'bg-primary text-white border-primary shadow-sm shadow-primary/30'
                : 'border-gray-200 dark:border-ink-600 text-gray-500 dark:text-gray-400 hover:border-primary'"
            >
              {{ day }}
            </button>
          </div>

          <!-- Heures + Heure de début -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-mono font-bold uppercase text-gray-400 mb-2">
                {{ t('planning.hoursPerDay') }}
              </label>
              <div class="flex items-center gap-3">
                <input
                  type="range"
                  min="1" max="10"
                  v-model.number="config.hoursPerDay"
                  class="flex-1 accent-primary"
                />
                <span class="font-display font-bold text-primary text-lg min-w-[40px]">{{ config.hoursPerDay }}h</span>
              </div>
            </div>
            <div>
              <label class="block text-xs font-mono font-bold uppercase text-gray-400 mb-2">
                {{ t('planning.startHour') }}
              </label>
              <div class="flex items-center gap-3">
                <input
                  type="range"
                  min="6" max="20"
                  v-model.number="config.startHour"
                  class="flex-1 accent-primary"
                />
                <span class="font-display font-bold text-primary text-lg min-w-[50px]">{{ config.startHour }}:00</span>
              </div>
            </div>
          </div>

          <!-- Generate button -->
          <div class="mt-5 flex gap-3">
            <AppButton
              variant="primary"
              size="md"
              :loading="planningStore.loading"
              @click="generatePlanning"
              class="group"
            >
              <template #icon-left><Sparkles :size="16" /></template>
              {{ planningStore.planning ? t('planning.regenerate') : t('planning.generate') }}
            </AppButton>

            <AppButton
              v-if="planningStore.planning && hasMissed"
              variant="outline"
              size="md"
              :loading="rescheduling"
              @click="doReschedule"
            >
              <template #icon-left><RefreshCw :size="16" /></template>
              {{ t('planning.reschedule') }}
            </AppButton>
          </div>
        </div>

        <!-- Stats card -->
        <div
          v-if="planningStore.planning"
          class="bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-2xl p-6 shadow-sm space-y-4"
        >
          <h2 class="font-display font-bold text-base text-gray-900 dark:text-white">
            {{ t('planning.readinessScore') }}
          </h2>

          <!-- Score ring -->
          <div class="flex items-center justify-center py-2">
            <div class="relative w-24 h-24">
              <svg viewBox="0 0 36 36" class="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" stroke-width="2.5" class="text-gray-100 dark:text-ink-700" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke="currentColor" stroke-width="2.5"
                  stroke-dasharray="100" class="text-primary transition-all duration-1000"
                  :stroke-dashoffset="100 - planningStore.planning.overallReadinessScore"
                  stroke-linecap="round"
                />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="font-display font-bold text-xl text-primary">{{ planningStore.planning.overallReadinessScore }}%</span>
              </div>
            </div>
          </div>

          <div class="space-y-2 text-sm">
            <div class="flex justify-between text-gray-600 dark:text-gray-400">
              <span>{{ t('planning.totalSessions') }}</span>
              <span class="font-semibold text-gray-900 dark:text-white">{{ totalSessions }}</span>
            </div>
            <div class="flex justify-between text-gray-600 dark:text-gray-400">
              <span>{{ t('planning.completedSessions') }}</span>
              <span class="font-semibold text-secondary">{{ completedSessions }}</span>
            </div>
            <div class="flex justify-between text-gray-600 dark:text-gray-400">
              <span>{{ t('planning.missedSessions') }}</span>
              <span class="font-semibold text-warm">{{ missedSessions }}</span>
            </div>
          </div>
        </div>

        <!-- Empty stats -->
        <div v-else class="bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Calendar :size="22" class="text-primary" />
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('planning.noPlanningDesc') }}</p>
        </div>
      </div>

      <!-- ── Sessions calendrier semaine ── -->
      <div v-if="planningStore.planning" class="bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-2xl shadow-sm overflow-hidden">

        <!-- Week navigation -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-surface-border dark:border-ink-700">
          <button @click="prevWeek" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-ink-700 transition text-gray-500 dark:text-gray-400">
            <ChevronLeft :size="18" />
          </button>
          <span class="font-display font-bold text-gray-900 dark:text-white text-sm">
            {{ t('planning.weekOf') }} {{ formatWeekStart }}
          </span>
          <button @click="nextWeek" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-ink-700 transition text-gray-500 dark:text-gray-400">
            <ChevronRight :size="18" />
          </button>
        </div>

        <!-- Sessions list -->
        <div class="divide-y divide-gray-100 dark:divide-ink-700">
          <div v-if="weekSessions.length === 0" class="py-12 text-center text-sm text-gray-400">
            {{ t('planning.noSessionsWeek') }}
          </div>

          <div
            v-for="session in weekSessions"
            :key="session._id"
            class="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-ink-700/50 transition group"
          >
            <!-- Color dot -->
            <div class="w-2 h-10 rounded-full shrink-0" :style="{ background: session.subjectColor }"></div>

            <!-- Date + time -->
            <div class="min-w-[100px] shrink-0">
              <p class="text-xs font-mono text-gray-400">{{ formatDate(session.date) }}</p>
              <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ session.startTime }} – {{ session.endTime }}</p>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-gray-900 dark:text-white truncate">{{ session.subjectName }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ session.chapterTitle }}</p>
              <div v-if="session.hasBreak" class="flex items-center gap-1 mt-0.5">
                <Coffee :size="11" class="text-gray-300" />
                <span class="text-[11px] text-gray-400 font-mono">{{ t('planning.break') }} {{ session.breakDurationMinutes }}{{ t('planning.min') }}</span>
              </div>
            </div>

            <!-- Duration -->
            <div class="shrink-0 text-center hidden sm:block">
              <p class="font-display font-bold text-gray-900 dark:text-white">{{ session.durationMinutes }}</p>
              <p class="text-[11px] font-mono text-gray-400">{{ t('planning.min') }}</p>
            </div>

            <!-- Status badge -->
            <div class="shrink-0">
              <span
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
                :class="statusClass(session.status)"
              >
                <component :is="statusIcon(session.status)" :size="12" />
                {{ statusLabel(session.status) }}
              </span>
            </div>

            <!-- Actions -->
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

      <!-- Empty state global -->
      <div
        v-if="!planningStore.planning && !planningStore.loading"
        class="bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-2xl p-16 text-center shadow-sm"
      >
        <div class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <CalendarDays :size="28" class="text-primary" />
        </div>
        <h3 class="font-display font-bold text-xl text-gray-900 dark:text-white mb-2">{{ t('planning.noPlanning') }}</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">{{ t('planning.noPlanningDesc') }}</p>
      </div>

    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Sparkles, RefreshCw, Calendar, CalendarDays,
  ChevronLeft, ChevronRight, Check, X, Coffee
} from '@lucide/vue'
import AppLayout from '@/shared/components/AppLayout.vue'
import AppButton from '@/shared/components/AppButton.vue'
import { usePlanningStore } from '@/stores/planning.store'
import type { Session } from '@/stores/planning.store'

const { t } = useI18n()
const planningStore = usePlanningStore()

// ── Config ────────────────────────────────────────────────────────────────────
const config = ref({
  availableDays: [1, 2, 3, 4, 5],
  hoursPerDay: 4,
  startHour: 9
})

const weekDays = computed(() => [
  t('planning.monday'), t('planning.tuesday'), t('planning.wednesday'),
  t('planning.thursday'), t('planning.friday'), t('planning.saturday'), t('planning.sunday')
])

function toggleDay(day: number) {
  const idx = config.value.availableDays.indexOf(day)
  if (idx === -1) config.value.availableDays.push(day)
  else config.value.availableDays.splice(idx, 1)
}

// ── Week navigation ────────────────────────────────────────────────────────────
const currentWeekStart = ref(getMonday(new Date()))

function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function prevWeek() {
  const d = new Date(currentWeekStart.value)
  d.setDate(d.getDate() - 7)
  currentWeekStart.value = d
  loadWeek()
}

function nextWeek() {
  const d = new Date(currentWeekStart.value)
  d.setDate(d.getDate() + 7)
  currentWeekStart.value = d
  loadWeek()
}

const formatWeekStart = computed(() => {
  return currentWeekStart.value.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
})

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: 'short' })
}

// ── Week sessions ──────────────────────────────────────────────────────────────
const weekSessions = computed(() => planningStore.weekSessions)

async function loadWeek() {
  if (!planningStore.planning) return
  const iso = currentWeekStart.value.toISOString().split('T')[0]
  await planningStore.fetchWeek(iso)
}

// ── Stats ──────────────────────────────────────────────────────────────────────
const totalSessions = computed(() => planningStore.planning?.sessions.length ?? 0)
const completedSessions = computed(() =>
  planningStore.planning?.sessions.filter(s => s.status === 'completed').length ?? 0
)
const missedSessions = computed(() =>
  planningStore.planning?.sessions.filter(s => s.status === 'missed').length ?? 0
)
const hasMissed = computed(() => missedSessions.value > 0)

// ── Status helpers ─────────────────────────────────────────────────────────────
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

// ── Actions ────────────────────────────────────────────────────────────────────
async function generatePlanning() {
  await planningStore.generate(
    config.value.availableDays,
    config.value.hoursPerDay,
    config.value.startHour
  )
  await loadWeek()
}

async function markStatus(sessionId: string, status: 'completed' | 'missed') {
  await planningStore.updateStatus(sessionId, status)
}

const rescheduling = ref(false)
async function doReschedule() {
  rescheduling.value = true
  try {
    await planningStore.reschedule()
    await loadWeek()
  } finally {
    rescheduling.value = false
  }
}

// ── Init ───────────────────────────────────────────────────────────────────────
onMounted(async () => {
  await planningStore.fetch()
  if (planningStore.planning) {
    await loadWeek()
  }
})
</script>
