<template>
  <div class="bg-white dark:bg-ink-950 text-gray-900 dark:text-gray-100 transition-colors overflow-x-hidden">

    <!-- ===== NAV ===== -->
    <nav
      :class="[
        'sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-ink-950/80 border-b transition-shadow',
        scrolled ? 'border-gray-200 dark:border-ink-600 shadow-sm' : 'border-transparent'
      ]"
    >
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <AppLogo size="2xl" />

        <div class="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
          <a href="#features" class="relative group transition hover:text-gray-900 dark:hover:text-white">
            {{ t('nav.features') }}
            <span class="absolute -bottom-1.5 left-0 w-0 h-px bg-primary transition-all group-hover:w-full"></span>
          </a>
          <a href="#how" class="relative group transition hover:text-gray-900 dark:hover:text-white">
            {{ t('nav.howItWorks') }}
            <span class="absolute -bottom-1.5 left-0 w-0 h-px bg-primary transition-all group-hover:w-full"></span>
          </a>
        </div>

        <div class="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
          <template v-if="authStore.isAuthenticated">
          <AppButton variant="ghost" size="sm" to="/dashboard">{{ t('nav.dashboard') }}</AppButton>
          <AppButton variant="primary" size="sm" @click="authStore.logout(); $router.push('/')">
            {{ t('nav.logout') }}
          </AppButton>
        </template>
        <template v-else>
          <AppButton variant="ghost" size="sm" to="/login">{{ t('nav.login') }}</AppButton>
          <AppButton variant="primary" size="sm" to="/register">{{ t('nav.register') }}</AppButton>
        </template>
        </div>
      </div>
    </nav>

    <!-- ===== HERO ===== -->
    <section class="relative w-full px-6 pt-16 pb-20 overflow-hidden">
      <div class="max-w-6xl mx-auto px-6">

      <!-- grain -->
      <div
        class="absolute -top-48 left-0 right-0 h-[1200px] pointer-events-none opacity-30 dark:opacity-50"
        style="background-image: radial-gradient(circle, currentColor 1px, transparent 1px); background-size: 22px 22px;"
        :class="ui.theme === 'dark' ? 'text-white/10' : 'text-gray-300'"
      ></div>

      <!-- ambient glows -->
      <div class="absolute -top-64 -right-40 w-[700px] h-[700px] rounded-full pointer-events-none blur-3xl animate-drift"
           :class="ui.theme === 'dark' ? 'bg-primary/15' : 'bg-primary/5'"></div>
      <div class="absolute top-56 -left-52 w-[550px] h-[550px] rounded-full pointer-events-none blur-3xl animate-drift-reverse"
           :class="ui.theme === 'dark' ? 'bg-warm/10' : 'bg-warm/5'"></div>

      <div class="relative z-10 grid md:grid-cols-2 gap-14 items-center">
        <div>
          <div class="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-primary-soft mb-6 opacity-0 animate-rise" style="animation-delay: 0.05s">
            <span class="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_theme(colors.primary)] animate-pulse-dot"></span>
            {{ t('landing.badge') }}
          </div>

          <h1 class="font-display text-5xl md:text-[60px] leading-[1.06] font-bold tracking-tight mb-5 opacity-0 animate-rise" style="animation-delay: 0.12s">
            {{ t('landing.title1') }}<br>
            <span class="bg-gradient-to-br from-primary to-primary-soft bg-clip-text text-transparent">{{ t('landing.titleHighlight') }}</span>
            {{ t('landing.title2') }}
          </h1>

          <p class="text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-9 max-w-md opacity-0 animate-rise" style="animation-delay: 0.2s">
            {{ t('landing.description') }}
          </p>

          <div class="flex flex-wrap gap-3.5 mb-11 opacity-0 animate-rise" style="animation-delay: 0.28s">
            <AppButton variant="primary" size="lg" to="/register" class="group">
              {{ t('landing.ctaStart') }}
              <template #icon-right><ArrowRight :size="18" class="transition-transform group-hover:translate-x-1" /></template>
            </AppButton>
            <a href="#how">
              <AppButton variant="outline" size="lg">
                {{ t('landing.ctaFeatures') }}
              </AppButton>
            </a>
          </div>

          <div class="flex items-center gap-5 font-mono text-xs text-gray-400 dark:text-ink-600 opacity-0 animate-rise" style="animation-delay: 0.36s">
            <span>{{ t('landing.freeTag') }}</span>
            <span class="w-px h-3 bg-gray-200 dark:bg-ink-600"></span>
            <span>{{ t('landing.noCardTag') }}</span>
            <span class="w-px h-3 bg-gray-200 dark:bg-ink-600"></span>
            <span>{{ t('landing.aiTag') }}</span>
          </div>
        </div>

        <!-- Signature visual: animated weekly planner grid -->
        <div class="relative opacity-0 animate-rise" style="animation-delay: 0.3s">

          <div class="hidden lg:block absolute -top-4 right-8 z-20 opacity-0 animate-rise" style="animation-delay: 0.6s">
            <div class="bg-white dark:bg-ink-800 rounded-xl shadow-lg border border-gray-200 dark:border-ink-600 px-3.5 py-2.5 flex items-center gap-2 whitespace-nowrap text-xs font-medium animate-float">
              <span class="w-2 h-2 rounded-full bg-warm shadow-[0_0_8px_theme(colors.warm)]"></span>
              {{ t('landing.examModeChip') }}
            </div>
          </div>

          <AppCard class="relative shadow-2xl shadow-gray-200/60 dark:shadow-black/50 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary group">
            <div class="flex items-center justify-between mb-5">
              <div class="font-display font-bold text-[15px]">{{ t('landing.thisWeek') }}</div>
              <div class="font-mono text-[11px] tracking-wide bg-primary/10 text-primary-soft px-2.5 py-1 rounded-md">{{ t('landing.fourModules') }}</div>
            </div>

            <!-- week grid -->
            <div class="grid grid-cols-[32px_repeat(5,1fr)] gap-1.5 mb-4">
              <div></div>
              <div v-for="d in days" :key="d" class="font-mono text-[11px] text-gray-400 dark:text-ink-600 text-center pb-1.5">{{ d }}</div>

              <template v-for="(row, rowIdx) in grid" :key="rowIdx">
                <div class="font-mono text-[10px] text-gray-300 dark:text-ink-600 flex items-center justify-end pr-1.5">{{ row.time }}</div>
                <div
                  v-for="(cell, colIdx) in row.cells"
                  :key="colIdx"
                  class="h-8 rounded-md transition-transform duration-150"
                  :class="[
                    cell ? `${cell} opacity-0 animate-fill-in cursor-pointer hover:scale-110 hover:z-10` : 'bg-gray-100 dark:bg-ink-700'
                  ]"
                  :style="cell ? { animationDelay: `${0.6 + (rowIdx * 5 + colIdx) * 0.05}s` } : {}"
                ></div>
              </template>
            </div>

            <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-ink-600">
              <div class="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
                <div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-primary"></span>MongoDB</div>
                <div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-warm"></span>Algo</div>
                <div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-teal"></span>Réseaux</div>
              </div>
              <div class="text-right">
                <div class="font-display text-[26px] font-bold text-primary-soft leading-none">73%</div>
                <div class="font-mono text-[10px] tracking-wide text-gray-300 dark:text-ink-600">{{ t('landing.readyLabel') }}</div>
              </div>
            </div>
          </AppCard>

          <div class="hidden lg:block absolute -bottom-4 -left-4 z-20 opacity-0 animate-rise" style="animation-delay: 0.7s">
            <div class="bg-white dark:bg-ink-800 rounded-xl shadow-lg border border-gray-200 dark:border-ink-600 px-3.5 py-2.5 flex items-center gap-2 whitespace-nowrap text-xs font-medium animate-float-delayed">
              <Check :size="14" class="text-primary-soft" />
              {{ t('landing.completedChip') }}
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>

    <!-- ===== STATS ===== -->
    <section class="border-y border-gray-200 dark:border-ink-600 bg-gray-50 dark:bg-ink-900">
      <div class="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
        <div v-for="(stat, i) in stats" :key="stat.label" ref="statRefs" class="opacity-0" :class="{ 'animate-rise': visibleStats }" :style="{ animationDelay: `${i * 0.08}s` }">
          <p class="font-display text-4xl font-extrabold text-primary-soft tracking-tight">{{ stat.value }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1.5">{{ stat.label }}</p>
        </div>
      </div>
    </section>

    <!-- ===== FEATURES ===== -->
    <section id="features" class="max-w-6xl mx-auto px-6 py-24">
      <div class="text-center max-w-xl mx-auto mb-16">
        <div class="font-mono text-xs tracking-widest text-primary-soft uppercase mb-4">{{ t('landing.whyTag') }}</div>
        <h2 class="font-display text-3xl md:text-4xl font-bold tracking-tight mb-3">{{ t('landing.featuresTitle') }}</h2>
        <p class="text-gray-500 dark:text-gray-400">{{ t('landing.featuresSubtitle') }}</p>
      </div>

      <div class="grid md:grid-cols-3 gap-5">
        <div
          v-for="(feature, i) in features"
          :key="feature.title"
          ref="featureRefs"
          class="group bg-white dark:bg-ink-800 border border-gray-200 dark:border-ink-600 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-primary hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/40 opacity-0"
          :class="{ 'animate-rise': visibleFeatures }"
          :style="{ animationDelay: `${i * 0.08}s` }"
        >
          <!-- image -->
          <div class="relative h-40 overflow-hidden bg-gray-100 dark:bg-ink-700">
            <img :src="feature.image" :alt="feature.title" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div class="absolute inset-0 bg-gradient-to-t from-white dark:from-ink-800 via-transparent to-transparent opacity-60"></div>
            <div
              class="absolute bottom-3 left-3 w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
              :class="feature.iconBg"
            >
              <component :is="feature.icon" :size="18" :class="feature.iconColor" />
            </div>
          </div>

          <!-- content -->
          <div class="p-7">
            <h3 class="font-display text-lg font-bold mb-2.5 tracking-tight">{{ feature.title }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">{{ feature.desc }}</p>
            <div class="flex flex-wrap gap-2">
              <span v-for="tag in feature.tags" :key="tag" class="font-mono text-[11px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-ink-700 border border-gray-200 dark:border-ink-600 px-2.5 py-1 rounded-md">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== HOW IT WORKS ===== -->
    <section id="how" class="max-w-6xl mx-auto px-6 pb-24">
      <div class="text-center max-w-xl mx-auto mb-16">
        <div class="font-mono text-xs tracking-widest text-primary-soft uppercase mb-4">{{ t('landing.howTag') }}</div>
        <h2 class="font-display text-3xl md:text-4xl font-bold tracking-tight mb-3">{{ t('landing.howTitle') }}</h2>
        <p class="text-gray-500 dark:text-gray-400">{{ t('landing.howSubtitle') }}</p>
      </div>

      <div class="relative grid md:grid-cols-4 gap-10 md:gap-6">
        <div class="hidden md:block absolute top-[26px] left-[6%] right-[6%] h-px bg-gray-200 dark:bg-ink-600"></div>

        <div
          v-for="(step, i) in steps"
          :key="step.title"
          ref="stepRefs"
          class="relative group opacity-0"
          :class="{ 'animate-rise': visibleSteps }"
          :style="{ animationDelay: `${i * 0.08}s` }"
        >
          <div class="relative z-10 w-[52px] h-[52px] rounded-full bg-white dark:bg-ink-800 border-[1.5px] border-gray-200 dark:border-ink-600 flex items-center justify-center font-display font-bold text-lg mb-4 transition-all duration-300 group-hover:bg-primary group-hover:border-primary group-hover:text-white group-hover:scale-105">
            {{ i + 1 }}
          </div>
          <h4 class="font-display font-bold text-base mb-2">{{ step.title }}</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{{ step.desc }}</p>
        </div>
      </div>
    </section>

    <!-- ===== CTA ===== -->
    <section class="max-w-6xl mx-auto px-6 pb-24">
      <div class="relative bg-gradient-to-br from-primary to-[#4F52E8] rounded-3xl px-8 py-16 text-center text-white overflow-hidden">
        <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 24px 24px;"></div>
        <div class="relative z-10">
          <h2 class="font-display text-3xl md:text-4xl font-bold tracking-tight mb-3">{{ t('landing.ctaTitle') }}</h2>
          <p class="text-white/85 mb-2 max-w-xl mx-auto">{{ t('landing.ctaDesc') }}</p>
          <p class="text-white/60 text-xs font-mono tracking-wide mb-8">{{ t('landing.ctaFooter').toUpperCase() }}</p>
          <AppButton size="lg" to="/register" class="!bg-white !text-primary hover:!bg-gray-100 group">
            {{ t('landing.ctaButton') }}
            <template #icon-right><ArrowRight :size="18" class="transition-transform group-hover:translate-x-1" /></template>
          </AppButton>
        </div>
      </div>
    </section>

    <!-- ===== Footer ===== -->
    <footer class="border-t border-gray-200 dark:border-ink-600 py-8">
      <div class="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
        <span class="font-display font-bold text-gray-900 dark:text-white"><AppLogo size="2xl" /></span>
        <span>© 2026 Revix. {{ t('footer.rights') }}</span>
        <div class="flex gap-6">
          <a href="#" class="hover:text-primary transition">{{ t('footer.support') }}</a>
          <a href="#" class="hover:text-primary transition">{{ t('footer.privacy') }}</a>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { FileSearch, Zap, RefreshCw, Check, ArrowRight } from '@lucide/vue'
import AppButton from '@/shared/components/AppButton.vue'
import AppCard from '@/shared/components/AppCard.vue'
import ThemeToggle from '@/shared/components/ThemeToggle.vue'
import LanguageToggle from '@/shared/components/LanguageToggle.vue'
import AppLogo from '@/shared/components/AppLogo.vue'
import { useUiStore } from '@/stores/ui.store'

import pdfAnalysisImg from '@/assets/features/pdf-analysis.png'
import dynamicPlanningImg from '@/assets/features/dynamic-planning.png'
import catchupSystemImg from '@/assets/features/catchup-system.png'
import { useAuthStore } from '@/stores/auth.store'
const authStore = useAuthStore()
const { t } = useI18n()
const ui = useUiStore()

// Navbar shadow on scroll
const scrolled = ref(false)
function onScroll() {
  scrolled.value = window.scrollY > 8
}
onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

// ===== Signature visual: weekly planner grid =====
const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven']

// Tailwind gradient classes per subject
const A = 'bg-gradient-to-br from-primary to-primary-soft'      // MongoDB
const B = 'bg-gradient-to-br from-warm to-[#FFB199]'            // Algo
const C = 'bg-gradient-to-br from-teal to-[#7FD9CC]'            // Réseaux
const D = 'bg-gradient-to-br from-[#A78BFA] to-[#C4B5FD]'       // Other

const grid = [
  { time: '9h',  cells: [A, null, B, null, A] },
  { time: '11h', cells: [C, A, null, B, D] },
  { time: '14h', cells: [null, D, C, B, null] },
  { time: '16h', cells: [B, null, A, null, C] },
]

// ===== Scroll-triggered reveals =====
const visibleStats = ref(false)
const visibleFeatures = ref(false)
const visibleSteps = ref(false)
const statRefs = ref<HTMLElement[]>([])
const featureRefs = ref<HTMLElement[]>([])
const stepRefs = ref<HTMLElement[]>([])

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      if (statRefs.value.includes(entry.target as HTMLElement)) visibleStats.value = true
      if (featureRefs.value.includes(entry.target as HTMLElement)) visibleFeatures.value = true
      if (stepRefs.value.includes(entry.target as HTMLElement)) visibleSteps.value = true
    })
  }, { threshold: 0.15 })

  ;[...statRefs.value, ...featureRefs.value, ...stepRefs.value].forEach(el => el && observer.observe(el))
})

// ===== Content =====
const stats = computed(() => [
  { value: '+23%', label: t('landing.stat1') },
  { value: '10h', label: t('landing.stat2') },
  { value: '100%', label: t('landing.stat3') }
])

const features = computed(() => [
  {
    title: t('landing.feature1Title'),
    desc: t('landing.feature1Desc'),
    icon: FileSearch,
    image: pdfAnalysisImg,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary-soft',
    tags: [t('landing.feature1Tag1'), t('landing.feature1Tag2')]
  },
  {
    title: t('landing.feature2Title'),
    desc: t('landing.feature2Desc'),
    icon: Zap,
    image: dynamicPlanningImg,
    iconBg: 'bg-warm/10',
    iconColor: 'text-warm-dark dark:text-warm',
    tags: [t('landing.feature2Tag1'), t('landing.feature2Tag2')]
  },
  {
    title: t('landing.feature3Title'),
    desc: t('landing.feature3Desc'),
    icon: RefreshCw,
    image: catchupSystemImg,
    iconBg: 'bg-teal/10',
    iconColor: 'text-teal',
    tags: [t('landing.feature3Tag1'), t('landing.feature3Tag2')]
  }
])

const steps = computed(() => [
  { title: t('landing.step1Title'), desc: t('landing.step1Desc') },
  { title: t('landing.step2Title'), desc: t('landing.step2Desc') },
  { title: t('landing.step3Title'), desc: t('landing.step3Desc') },
  { title: t('landing.step4Title'), desc: t('landing.step4Desc') }
])
</script>