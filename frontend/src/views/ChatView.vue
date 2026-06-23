<template>
  <AppLayout :title="t('chat.title')" :subtitle="t('chat.subtitle')">
    <div class="p-4 md:p-8 max-w-3xl mx-auto h-[calc(100vh-4rem)] flex flex-col">

      <div class="flex items-center gap-3 mb-4">
        <select
          v-model="selectedSubjectId"
          class="flex-1 rounded-xl border border-gray-300 dark:border-ink-600 bg-white dark:bg-ink-900 text-gray-900 dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
        >
          <option value="">{{ t('chat.selectModule') }}</option>
          <option v-for="s in subjectsStore.subjects" :key="s._id" :value="s._id">{{ s.name }}</option>
        </select>
        <button
          v-if="selectedSubjectId && chatStore.messages.length > 0"
          @click="confirmClear"
          class="p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition shrink-0"
          :title="t('chat.clearHistory')"
        >
          <Trash2 :size="16" />
        </button>
      </div>

      <div v-if="!selectedSubjectId" class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <div class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Bot :size="28" class="text-primary" />
          </div>
          <h3 class="font-display font-bold text-xl text-gray-900 dark:text-white mb-2">{{ t('chat.emptyTitle') }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">{{ t('chat.emptyDescription') }}</p>
        </div>
      </div>

      <template v-else>
        <div ref="scrollContainer" class="flex-1 overflow-y-auto space-y-4 pb-4">

          <div v-if="chatStore.loading" class="flex justify-center py-8">
            <AppSpinner size="md" />
          </div>

          <div v-else-if="chatStore.messages.length === 0" class="text-center py-12">
            <div class="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <MessageCircle :size="24" class="text-primary" />
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('chat.startConversation') }}</p>
          </div>

          <div
            v-for="msg in chatStore.messages"
            :key="msg._id"
            class="flex gap-3"
            :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
          >
            <div v-if="msg.role === 'assistant'" class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Bot :size="16" class="text-primary" />
            </div>
            <div
              class="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap"
              :class="msg.role === 'user'
                ? 'bg-primary text-white rounded-br-md'
                : 'bg-gray-50 dark:bg-ink-900/60 border border-gray-100 dark:border-ink-700 text-gray-800 dark:text-gray-200 rounded-bl-md'"
            >
              {{ msg.content }}
            </div>
          </div>

          <div v-if="chatStore.sending" class="flex gap-3 justify-start">
            <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Bot :size="16" class="text-primary" />
            </div>
            <div class="bg-gray-50 dark:bg-ink-900/60 border border-gray-100 dark:border-ink-700 rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-ink-600 animate-bounce" style="animation-delay: 0ms" />
              <span class="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-ink-600 animate-bounce" style="animation-delay: 150ms" />
              <span class="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-ink-600 animate-bounce" style="animation-delay: 300ms" />
            </div>
          </div>
        </div>

        <p v-if="chatStore.error" class="text-sm text-red-500 mb-2">{{ chatStore.error }}</p>

        <form @submit.prevent="send" class="flex items-end gap-2 pt-2 border-t border-gray-100 dark:border-ink-700">
          <textarea
            v-model="question"
            rows="1"
            :placeholder="t('chat.inputPlaceholder')"
            class="flex-1 resize-none rounded-xl border border-gray-300 dark:border-ink-600 bg-white dark:bg-ink-900 text-gray-900 dark:text-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition max-h-32"
            @keydown.enter.exact.prevent="send"
          />
          <button
            type="submit"
            :disabled="!question.trim() || chatStore.sending"
            class="w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary/90 disabled:bg-primary/40 disabled:cursor-not-allowed transition shrink-0"
          >
            <Send :size="18" />
          </button>
        </form>
      </template>

    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Bot, MessageCircle, Send, Trash2 } from '@lucide/vue'
import AppLayout from '@/shared/components/AppLayout.vue'
import AppSpinner from '@/shared/components/AppSpinner.vue'
import { useSubjectsStore } from '@/stores/subjects.store'
import { useChatStore } from '@/stores/chat.store'
import { useConfirm } from '@/shared/composables/useConfirm'
const { confirm } = useConfirm()
const { t } = useI18n()
const route = useRoute()
const subjectsStore = useSubjectsStore()
const chatStore = useChatStore()

const selectedSubjectId = ref('')
const question = ref('')
const scrollContainer = ref<HTMLElement | null>(null)

function scrollToBottom() {
  nextTick(() => {
    if (scrollContainer.value) scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
  })
}

watch(selectedSubjectId, async (id) => {
  chatStore.reset()
  if (id) {
    await chatStore.fetchHistory(id)
    scrollToBottom()
  }
})

watch(() => chatStore.messages.length, scrollToBottom)

async function send() {
  const q = question.value.trim()
  if (!q || !selectedSubjectId.value) return
  question.value = ''
  try {
    await chatStore.ask(selectedSubjectId.value, q)
  } catch {
    // erreur déjà affichée via chatStore.error
  }
}

async function confirmClear() {
  const ok = await confirm({
    message: t('chat.confirmClear'),
    confirmLabel: t('chat.clearHistory'),
    danger: true
  })
  if (!ok) return
  chatStore.clearHistory(selectedSubjectId.value)
}

onMounted(async () => {
  await subjectsStore.fetchAll()
  const presetId = route.query.subjectId as string | undefined
  if (presetId) selectedSubjectId.value = presetId
})
</script>