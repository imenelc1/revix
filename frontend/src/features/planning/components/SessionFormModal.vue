<template>
  <AppModal :show="show" @close="$emit('close')">
    <h3 class="font-display font-bold text-lg text-gray-900 dark:text-white mb-4">
      {{ isEdit ? t('planning.editSession') : t('planning.addSession') }}
    </h3>

    <div class="space-y-4">
      <div>
        <label class="block text-xs font-mono font-bold uppercase text-gray-400 mb-1.5">{{ t('planning.formModule') }}</label>
        <select
          v-model="form.subjectId"
          class="w-full rounded-xl border border-gray-300 dark:border-ink-600 bg-white dark:bg-ink-900 text-gray-900 dark:text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
        >
          <option value="">{{ t('planning.formSelectModule') }}</option>
          <option v-for="s in subjectsStore.subjects" :key="s._id" :value="s._id">{{ s.name }}</option>
        </select>
      </div>

      <div>
        <label class="block text-xs font-mono font-bold uppercase text-gray-400 mb-1.5">{{ t('planning.formChapter') }}</label>
        <select
          v-if="selectedSubject"
          v-model="form.chapterId"
          class="w-full rounded-xl border border-gray-300 dark:border-ink-600 bg-white dark:bg-ink-900 text-gray-900 dark:text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition mb-2"
        >
          <option value="">{{ t('planning.formCustomTitleOption') }}</option>
          <option v-for="c in selectedSubject.chapters" :key="c._id" :value="c._id">{{ c.title }}</option>
        </select>
        <input
          v-if="!form.chapterId"
          v-model="form.customTitle"
          :placeholder="t('planning.formCustomTitlePlaceholder')"
          class="w-full rounded-xl border border-gray-300 dark:border-ink-600 bg-white dark:bg-ink-900 text-gray-900 dark:text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
        />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-mono font-bold uppercase text-gray-400 mb-1.5">{{ t('planning.formDate') }}</label>
          <input type="date" v-model="form.date" class="w-full rounded-xl border border-gray-300 dark:border-ink-600 bg-white dark:bg-ink-900 text-gray-900 dark:text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition" />
        </div>
        <div>
          <label class="block text-xs font-mono font-bold uppercase text-gray-400 mb-1.5">{{ t('planning.formStartTime') }}</label>
          <input type="time" v-model="form.startTime" class="w-full rounded-xl border border-gray-300 dark:border-ink-600 bg-white dark:bg-ink-900 text-gray-900 dark:text-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition" />
        </div>
      </div>

      <div>
        <label class="block text-xs font-mono font-bold uppercase text-gray-400 mb-1.5">{{ t('planning.formDuration') }}</label>
        <div class="flex items-center gap-3">
          <input type="range" min="15" max="240" step="15" v-model.number="form.durationMinutes" class="flex-1 accent-primary" />
          <span class="font-display font-bold text-primary text-sm min-w-[64px] text-right">{{ form.durationMinutes }} {{ t('planning.min') }}</span>
        </div>
      </div>

      <p v-if="formError" class="text-sm text-red-500">{{ formError }}</p>

      <div class="flex items-center justify-between gap-3 pt-2">
        <button
          v-if="isEdit"
          @click="handleDelete"
          class="min-h-[44px] text-sm font-semibold text-red-500 hover:text-red-600 transition"
        >
          {{ t('planning.deleteSession') }}
        </button>
        <div v-else />
        <div class="flex gap-3">
          <button @click="$emit('close')" class="min-h-[44px] px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-ink-700 transition">
            {{ t('common.cancel') }}
          </button>
          <AppButton variant="primary" size="sm" :loading="saving" @click="handleSave">
            {{ t('subjects.save') }}
          </AppButton>
        </div>
      </div>
    </div>
  </AppModal>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AppModal from '@/shared/components/AppModal.vue'
import AppButton from '@/shared/components/AppButton.vue'
import { useSubjectsStore } from '@/stores/subjects.store'
import { usePlanningStore } from '@/stores/planning.store'
import type { Session } from '@/stores/planning.store'

const { t } = useI18n()
const subjectsStore = useSubjectsStore()
const planningStore = usePlanningStore()

const props = defineProps<{
  show: boolean
  session?: Session | null
  defaultDate?: string
}>()

const emit = defineEmits<{ close: []; saved: [] }>()

const isEdit = computed(() => !!props.session)
const saving = ref(false)
const formError = ref('')
const skipSubjectWatch = ref(false)

const form = reactive({
  subjectId: '',
  chapterId: '',
  customTitle: '',
  date: '',
  startTime: '09:00',
  durationMinutes: 60
})

const selectedSubject = computed(() =>
  subjectsStore.subjects.find(s => s._id === form.subjectId) || null
)

function resetForm() {
  skipSubjectWatch.value = true
  if (props.session) {
    form.subjectId = props.session.subjectId || ''
    form.chapterId = props.session.chapterId || ''
    form.customTitle = props.session.chapterId ? '' : props.session.chapterTitle
    form.date = props.session.date.slice(0, 10)
    form.startTime = props.session.startTime
    form.durationMinutes = props.session.durationMinutes
  } else {
    form.subjectId = ''
    form.chapterId = ''
    form.customTitle = ''
    form.date = props.defaultDate || new Date().toISOString().slice(0, 10)
    form.startTime = '09:00'
    form.durationMinutes = 60
  }
  formError.value = ''
}

watch(() => props.show, (val) => { if (val) resetForm() })
watch(() => form.subjectId, () => {
  if (skipSubjectWatch.value) {
    skipSubjectWatch.value = false
    return
  }
  form.chapterId = ''
})

async function handleSave() {
  formError.value = ''
  if (!form.chapterId && !form.customTitle.trim()) { formError.value = t('planning.formErrorTitle'); return }
  if (!form.date || !form.startTime) { formError.value = t('planning.formErrorDateTime'); return }

  saving.value = true
  try {
    const payload = {
      subjectId: form.subjectId || (isEdit.value ? null : undefined),
      chapterId: form.chapterId || undefined,
      customTitle: form.chapterId ? undefined : form.customTitle.trim(),
      date: form.date,
      startTime: form.startTime,
      durationMinutes: form.durationMinutes
    }
    if (isEdit.value && props.session) {
      await planningStore.updateSession(props.session._id, payload)
    } else {
      await planningStore.addSession(payload)
    }
    emit('saved')
    emit('close')
  } catch (err: any) {
    formError.value = err.response?.data?.error || t('common.unexpectedError')
  } finally {
    saving.value = false
  }
}

async function handleDelete() {
  if (!props.session) return
  saving.value = true
  try {
    await planningStore.deleteSession(props.session._id)
    emit('saved')
    emit('close')
  } catch {
    formError.value = t('common.unexpectedError')
  } finally {
    saving.value = false
  }
}
</script>
