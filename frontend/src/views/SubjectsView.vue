<template>
  <AppLayout :title="t('sidebar.modules')">
    <div class="p-4 md:p-8 max-w-5xl mx-auto space-y-6">

      <!-- Header -->
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
          class="bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
        >
          <!-- Card header -->
          <div class="flex items-start gap-3 p-5 pb-3">
            <div
              class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-display font-bold text-sm shrink-0"
              :style="{ background: subject.color }"
            >
              {{ subject.name.charAt(0).toUpperCase() }}
            </div>

            <!-- Nom + date en mode lecture ou édition -->
            <div class="flex-1 min-w-0">
              <template v-if="editingSubjectId === subject._id">
                <input
                  v-model="editForm.name"
                  class="w-full text-sm font-bold bg-transparent border-b border-primary outline-none text-gray-900 dark:text-white pb-0.5 mb-1"
                  @keyup.enter="saveSubject(subject._id)"
                  @keyup.escape="cancelEditSubject"
                />
                <input
                  type="date"
                  v-model="editForm.examDate"
                  class="w-full text-xs bg-transparent border-b border-gray-300 dark:border-ink-600 outline-none text-gray-500 dark:text-gray-400 pb-0.5"
                />
                <!-- Couleurs -->
                <div class="flex gap-1.5 mt-2 flex-wrap">
                  <button
                    v-for="color in moduleColors"
                    :key="color"
                    @click="editForm.color = color"
                    class="w-5 h-5 rounded-md transition-transform hover:scale-110"
                    :style="{ background: color }"
                    :class="editForm.color === color ? 'ring-2 ring-offset-1 ring-primary scale-110' : ''"
                  />
                </div>
              </template>
              <template v-else>
                <h4 class="font-display font-bold text-gray-900 dark:text-white text-sm truncate">{{ subject.name }}</h4>
                <p class="text-xs text-gray-400 font-mono">
                  {{ t('subjects.daysRemaining', { days: daysUntilExam(subject.examDate) }) }}
                  · {{ formatExamDate(subject.examDate) }}
                </p>
              </template>
            </div>

            <!-- Actions header -->
            <div class="flex gap-1 shrink-0">
              <template v-if="editingSubjectId === subject._id">
                <button @click="saveSubject(subject._id)" class="p-1.5 rounded-lg text-secondary hover:bg-secondary/10 transition" title="Sauvegarder">
                  <Check :size="15" />
                </button>
                <button @click="cancelEditSubject" class="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-ink-700 transition" title="Annuler">
                  <X :size="15" />
                </button>
              </template>
              <template v-else>
                <button @click="startEditSubject(subject)" class="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition" title="Modifier">
                  <Pencil :size="15" />
                </button>
                <button @click="confirmDeleteSubject(subject._id)" class="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition" title="Supprimer">
                  <Trash2 :size="15" />
                </button>
              </template>
            </div>
          </div>

          <!-- Progress bar -->
          <div class="px-5 mb-3">
            <div class="flex justify-between text-xs mb-1">
              <span class="text-gray-500 dark:text-gray-400">{{ t('subjects.chapters', { count: subject.chapters.length }) }}</span>
              <span class="font-semibold text-gray-900 dark:text-white">{{ subjectProgress(subject) }}%</span>
            </div>
            <div class="h-1.5 bg-gray-100 dark:bg-ink-700 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500"
                :style="{ width: subjectProgress(subject) + '%', background: subject.color }"
              />
            </div>
          </div>

          <!-- Chapitres -->
          <div class="px-5 pb-3 space-y-1">
            <div
              v-for="chapter in subject.chapters"
              :key="chapter._id"
              class="group/ch flex items-center gap-2 py-1.5 rounded-lg px-2 hover:bg-gray-50 dark:hover:bg-ink-900/60 transition"
            >
              <component
                :is="masteryIcon(chapter.masteryLevel)"
                :size="14"
                class="shrink-0"
                :class="masteryClass(chapter.masteryLevel)"
              />

              <!-- Titre chapitre — mode lecture ou édition inline -->
              <template v-if="editingChapter?.subjectId === subject._id && editingChapter?.chapterId === chapter._id">
                <input
                  v-model="chapterForm.title"
                  class="flex-1 text-xs bg-transparent border-b border-primary outline-none text-gray-900 dark:text-white"
                  @keyup.enter="saveChapter(subject._id, chapter._id)"
                  @keyup.escape="cancelEditChapter"
                  ref="chapterInput"
                />
                <!-- Maîtrise -->
                <div class="flex gap-1">
                  <button
                    v-for="lvl in masteryLevels"
                    :key="lvl.value"
                    @click="chapterForm.masteryLevel = lvl.value"
                    :title="lvl.label"
                    class="w-5 h-5 rounded flex items-center justify-center transition"
                    :class="chapterForm.masteryLevel === lvl.value ? lvl.activeClass : 'text-gray-300 hover:text-gray-500'"
                  >
                    <component :is="lvl.icon" :size="12" />
                  </button>
                </div>
                <!-- Difficulté -->
                <select
                  v-model="chapterForm.difficulty"
                  class="text-[10px] border border-gray-200 dark:border-ink-600 rounded px-1 py-0.5 bg-white dark:bg-ink-800 text-gray-700 dark:text-gray-300 outline-none"
                >
                  <option value="low">Faible</option>
                  <option value="medium">Moyen</option>
                  <option value="high">Élevé</option>
                </select>
                <button @click="saveChapter(subject._id, chapter._id)" class="text-secondary hover:text-secondary/80 transition">
                  <Check :size="13" />
                </button>
                <button @click="cancelEditChapter" class="text-gray-400 hover:text-gray-600 transition">
                  <X :size="13" />
                </button>
              </template>

              <template v-else>
                <span class="flex-1 text-xs text-gray-700 dark:text-gray-300 truncate">{{ chapter.title }}</span>
                <span class="text-[10px] font-mono text-gray-300 dark:text-ink-600 shrink-0 hidden group-hover/ch:inline">
                  {{ difficultyLabel(chapter.difficulty) }}
                </span>
                <div class="flex gap-0.5 opacity-0 group-hover/ch:opacity-100 transition shrink-0">
                  <button
                    @click="startEditChapter(subject._id, chapter)"
                    class="p-1 rounded text-gray-400 hover:text-primary transition"
                    title="Modifier"
                  >
                    <Pencil :size="11" />
                  </button>
                  <button
                    @click="deleteChapter(subject._id, chapter._id)"
                    class="p-1 rounded text-gray-400 hover:text-red-500 transition"
                    title="Supprimer"
                  >
                    <Trash2 :size="11" />
                  </button>
                </div>
              </template>
            </div>

            <!-- Ajouter un chapitre inline -->
            <div v-if="addingChapterFor === subject._id" class="flex items-center gap-2 py-1.5 px-2">
              <Plus :size="13" class="text-primary shrink-0" />
              <input
                v-model="newChapterTitle"
                class="flex-1 text-xs bg-transparent border-b border-primary outline-none text-gray-900 dark:text-white placeholder:text-gray-300"
                placeholder="Titre du chapitre..."
                @keyup.enter="addChapter(subject._id)"
                @keyup.escape="addingChapterFor = null"
                ref="newChapterInput"
              />
              <button @click="addChapter(subject._id)" class="text-secondary hover:text-secondary/80 transition">
                <Check :size="13" />
              </button>
              <button @click="addingChapterFor = null" class="text-gray-400 hover:text-gray-600 transition">
                <X :size="13" />
              </button>
            </div>
          </div>

          <!-- Documents importés -->
          <div class="px-5 pb-3">
            <button
              @click="toggleDocuments(subject._id)"
              class="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition mb-2"
            >
              <FileText :size="13" />
              {{ t('subjects.documents', { count: documentsStore.documents.filter(d => d.subjectId === subject._id).length }) }}
              <ChevronDown :size="13" class="transition-transform" :class="expandedDocsFor === subject._id ? 'rotate-180' : ''" />
            </button>

            <div v-if="expandedDocsFor === subject._id" class="space-y-1.5 animate-rise">
              <div v-if="documentsLoading" class="text-xs text-gray-400 py-2">{{ t('subjects.loadingDocuments') }}</div>

              <div v-else-if="subjectDocuments(subject._id).length === 0" class="text-xs text-gray-400 py-2">
                {{ t('subjects.noDocuments') }}
              </div>

              <div
                v-for="doc in subjectDocuments(subject._id)"
                :key="doc._id"
                class="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-gray-50 dark:bg-ink-900/60 border border-gray-100 dark:border-ink-700 group/doc"
              >
                <FileText :size="13" class="text-primary-soft shrink-0" />
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{{ doc.fileName }}</p>
                  <p class="text-[10px] text-gray-400 font-mono">
                    {{ t('subjects.chaptersFromDoc', { count: doc.chaptersGenerated }) }} · {{ formatDocDate(doc.uploadedAt) }}
                  </p>
                </div>
                <button
                  @click="deleteDocument(doc._id)"
                  class="opacity-0 group-hover/doc:opacity-100 text-gray-300 hover:text-red-500 transition shrink-0"
                >
                  <Trash2 :size="13" />
                </button>
              </div>

              <RouterLink
                :to="{ path: '/pdf', query: { subjectId: subject._id } }"
                class="flex items-center gap-1.5 text-xs font-semibold text-primary-soft hover:text-primary transition mt-2"
              >
                <Plus :size="13" />
                {{ t('subjects.addDocument') }}
              </RouterLink>
            </div>
          </div>

          <!-- Footer card -->
          <div class="px-5 py-3 border-t border-gray-100 dark:border-ink-700 flex items-center justify-between">
            <span class="text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1" :class="riskInfo(subject.examDate).class">
              <component :is="riskInfo(subject.examDate).icon" :size="11" />
              {{ riskInfo(subject.examDate).label }}
            </span>
            <div class="flex items-center gap-3">
              <RouterLink
                :to="{ path: '/chat', query: { subjectId: subject._id } }"
                class="text-xs font-semibold text-primary-soft hover:text-primary flex items-center gap-1 transition"
              >
                <MessageCircle :size="13" />
                {{ t('subjects.chatWithModule') }}
              </RouterLink>
              <button @click="startAddChapter(subject._id)" class="text-xs font-semibold text-primary-soft hover:text-primary flex items-center gap-1 transition">
                <Plus :size="13" />
                {{ t('subjects.addChapterBtn') }}
              </button>
            </div>
        </div>
      </div>
      </div>

    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  Plus, Trash2, BookOpen, Pencil, Check, X,
  AlertCircle, Clock3, CheckCircle2, XCircle, HelpCircle, CheckCircle, Frown, Meh, Smile,
  FileText, ChevronDown,MessageCircle
} from '@lucide/vue'
import AppLayout from '@/shared/components/AppLayout.vue'
import AppButton from '@/shared/components/AppButton.vue'
import AppSpinner from '@/shared/components/AppSpinner.vue'
import { useSubjectsStore } from '@/stores/subjects.store'
import { useDocumentsStore } from '@/stores/documents.store'
import type { Subject, Chapter } from '@/stores/subjects.store'
import { useConfirm } from '@/shared/composables/useConfirm'
import { useToast } from '@/shared/composables/useToast'
import { formatShortDate } from '@/shared/utils/dates'
const { confirm } = useConfirm()
const toast = useToast()
const { t } = useI18n()
const subjectsStore = useSubjectsStore()
const documentsStore = useDocumentsStore()

// ── Documents par module ──────────────────────────────────────────────────────
const expandedDocsFor = ref<string | null>(null)
const documentsLoading = ref(false)

async function toggleDocuments(subjectId: string) {
  if (expandedDocsFor.value === subjectId) {
    expandedDocsFor.value = null
    return
  }
  expandedDocsFor.value = subjectId
  documentsLoading.value = true
  try {
    await documentsStore.fetchBySubject(subjectId)
  } finally {
    documentsLoading.value = false
  }
}

function subjectDocuments(subjectId: string) {
  return documentsStore.documents.filter(d => d.subjectId === subjectId)
}

async function deleteDocument(id: string) {
  await documentsStore.remove(id)
}

function formatExamDate(date: string): string {
  return formatShortDate(date, locale.value)
}

function formatDocDate(date: string): string {
  return formatShortDate(date, locale.value)
}

// ── Couleurs disponibles ──────────────────────────────────────────────────────
const moduleColors = [
  '#6366F1', '#10B981', '#FF8A5B', '#4ABDAC',
  '#F59E0B', '#EC4899', '#8B5CF6', '#14B8A6'
]

// ── Edit module ───────────────────────────────────────────────────────────────
const editingSubjectId = ref<string | null>(null)
const editForm = reactive({ name: '', examDate: '', color: '' })

function startEditSubject(subject: Subject) {
  editingSubjectId.value = subject._id
  editForm.name     = subject.name
  editForm.examDate = subject.examDate.slice(0, 10)
  editForm.color    = subject.color
}

function cancelEditSubject() {
  editingSubjectId.value = null
}

async function saveSubject(id: string) {
  if (!editForm.name.trim()) return
  await subjectsStore.update(id, {
    name:     editForm.name,
    examDate: editForm.examDate,
    color:    editForm.color,
  })
  editingSubjectId.value = null
}

async function confirmDeleteSubject(id: string) {
  const ok = await confirm({
    title: t('subjects.deleteConfirmTitle'),
    message: t('subjects.deleteConfirm'),
    confirmLabel: t('subjects.delete'),
    danger: true
  })
  if (!ok) return
  try {
    await subjectsStore.remove(id)
    toast.success(t('subjects.deletedSuccess'))
  } catch {
    toast.error(t('common.unexpectedError'))
  }
}

// ── Edit chapitre ─────────────────────────────────────────────────────────────
const editingChapter = ref<{ subjectId: string; chapterId: string } | null>(null)
const chapterForm = reactive({
  title:        '',
  masteryLevel: 'average' as 'not_understood' | 'average' | 'mastered',
  difficulty:   'medium'  as 'low' | 'medium' | 'high',
})
const chapterInput = ref<HTMLInputElement | null>(null)

function startEditChapter(subjectId: string, chapter: Chapter) {
  editingChapter.value = { subjectId, chapterId: chapter._id }
  chapterForm.title        = chapter.title
  chapterForm.masteryLevel = chapter.masteryLevel
  chapterForm.difficulty   = chapter.difficulty
  nextTick(() => { const el = chapterInput.value as any; if (el) (el.$el ?? el).focus() })
}

function cancelEditChapter() {
  editingChapter.value = null
}

async function saveChapter(subjectId: string, chapterId: string) {
  if (!chapterForm.title.trim()) return
  await subjectsStore.updateChapter(subjectId, chapterId, {
    title:        chapterForm.title,
    masteryLevel: chapterForm.masteryLevel,
    difficulty:   chapterForm.difficulty,
  })
  editingChapter.value = null
}

async function deleteChapter(subjectId: string, chapterId: string) {
  await subjectsStore.removeChapter(subjectId, chapterId)
}

// ── Ajout chapitre inline ─────────────────────────────────────────────────────
const addingChapterFor = ref<string | null>(null)
const newChapterTitle  = ref('')
const newChapterInput  = ref<HTMLInputElement | null>(null)

function startAddChapter(subjectId: string) {
  addingChapterFor.value = subjectId
  newChapterTitle.value  = ''
  nextTick(() => { const el = newChapterInput.value as any; if (el) (el.$el ?? el).focus() })
}

async function addChapter(subjectId: string) {
  if (!newChapterTitle.value.trim()) return
  await subjectsStore.addChapter(subjectId, {
    title:          newChapterTitle.value,
    masteryLevel:   'average',
    difficulty:     'medium',
    importanceScore: 3,
  })
  newChapterTitle.value  = ''
  addingChapterFor.value = null
}

// ── Helpers maîtrise ──────────────────────────────────────────────────────────
const masteryLevels = [
  { value: 'not_understood', icon: Frown,  label: 'Non compris', activeClass: 'text-warm' },
  { value: 'average',        icon: Meh,    label: 'Moyen',       activeClass: 'text-accent' },
  { value: 'mastered',       icon: Smile,  label: 'Maîtrisé',   activeClass: 'text-secondary' },
]

function masteryIcon(level: string) {
  return { not_understood: XCircle, average: HelpCircle, mastered: CheckCircle }[level] ?? HelpCircle
}

function masteryClass(level: string) {
  return { not_understood: 'text-warm', average: 'text-accent', mastered: 'text-secondary' }[level] ?? 'text-gray-400'
}

function difficultyLabel(d: string) {
  return { low: 'Faible', medium: 'Moyen', high: 'Élevé' }[d] ?? d
}

// ── Helpers module ────────────────────────────────────────────────────────────
function subjectProgress(subject: Subject): number {
  if (!subject.chapters.length) return 0
  return Math.round(subject.chapters.filter(c => c.masteryLevel === 'mastered').length / subject.chapters.length * 100)
}

function daysUntilExam(date: string): number {
  return Math.max(0, Math.ceil((new Date(date).getTime() - Date.now()) / 86400000))
}

function riskInfo(date: string) {
  const d = daysUntilExam(date)
  if (d <= 7)  return { label: t('subjects.urgent'), icon: AlertCircle, class: 'bg-warm/10 text-warm' }
  if (d <= 14) return { label: t('subjects.soon'),   icon: Clock3,      class: 'bg-accent/10 text-accent' }
  return              { label: t('subjects.ok'),     icon: CheckCircle2, class: 'bg-secondary/10 text-secondary' }
}

onMounted(() => subjectsStore.fetchAll())
</script>