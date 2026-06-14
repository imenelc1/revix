<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">

    <!-- Navbar -->
    <nav
      :class="[
        'sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-950/80 border-b transition-shadow',
        scrolled ? 'border-gray-200 dark:border-gray-800 shadow-sm' : 'border-transparent'
      ]"
    >
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center">
          <AppLogo size="xl" />
        </div>

        <div class="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
          <a href="#features" class="hover:text-primary transition">{{ t('nav.features') }}</a>
          <a href="#how" class="hover:text-primary transition">{{ t('nav.howItWorks') }}</a>
        </div>

        <div class="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
          <AppButton variant="ghost" size="sm" to="/login">{{ t('nav.login') }}</AppButton>
          <AppButton variant="primary" size="sm" to="/register">{{ t('nav.register') }}</AppButton>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="relative max-w-6xl mx-auto px-6 pt-20 pb-24 overflow-hidden">
      <!-- Background dot grid -->
      <div class="absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]">
        <div class="absolute inset-0 bg-[radial-gradient(circle,_theme(colors.gray.300)_1px,_transparent_1px)] dark:bg-[radial-gradient(circle,_theme(colors.gray.700)_1px,_transparent_1px)] [background-size:24px_24px] opacity-40"></div>
      </div>

      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles :size="16" />
            {{ t('landing.badge') }}
          </span>

          <h1 class="text-5xl md:text-6xl font-bold leading-[1.1] mb-4 tracking-tight">
            {{ t('landing.title1') }}
            <span class="relative inline-block">
              <span class="relative z-10 italic text-primary">{{ t('landing.titleHighlight') }}</span>
              <svg class="absolute -bottom-1 left-0 w-full overflow-visible" height="10" viewBox="0 0 200 10" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0,5 Q50,0 100,5 T200,5" stroke="currentColor" stroke-width="4" fill="none" class="text-secondary" vector-effect="non-scaling-stroke"/>
              </svg>
            </span>
            {{ t('landing.title2') }}
          </h1>

          <p class="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md">
            {{ t('landing.description') }}
          </p>

          <div class="flex flex-wrap gap-4">
            <AppButton variant="primary" size="lg" to="/register">
              {{ t('landing.ctaStart') }}
              <template #icon-right><ArrowRight :size="18" /></template>
            </AppButton>
            <a href="#features">
              <AppButton variant="outline" size="lg">
                {{ t('landing.ctaFeatures') }}
              </AppButton>
            </a>
          </div>
        </div>

        <!-- Animated mockup -->
        <div class="relative pt-6 pb-6 px-2">
          <!-- Floating mini cards -->
          <div class="hidden lg:block absolute -left-4 top-0 z-20 animate-float">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 px-3 py-2 flex items-center gap-2 whitespace-nowrap">
              <span class="w-2 h-2 rounded-full bg-secondary"></span>
              <span class="text-xs font-medium">MongoDB · 2h</span>
            </div>
          </div>
          <div class="hidden lg:block absolute -right-4 bottom-0 z-20 animate-float-delayed">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 px-3 py-2 flex items-center gap-2 whitespace-nowrap">
              <Check :size="14" class="text-secondary" />
              <span class="text-xs font-medium">Chapitre terminé</span>
            </div>
          </div>

          <AppCard class="relative shadow-xl">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-3 h-3 rounded-full bg-red-400"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div class="w-3 h-3 rounded-full bg-green-400"></div>
              <span class="ml-auto text-xs text-gray-400">{{ t('landing.dashboard') }}</span>
            </div>

            <div class="space-y-4">
              <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <FileText :size="20" class="text-primary shrink-0" />
                <div class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div class="h-full bg-primary rounded-full animate-fill-bar" style="--target-width: 66%"></div>
                </div>
                <span class="text-xs text-gray-400 shrink-0">{{ t('landing.analyzed') }}</span>
              </div>

              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-gray-600 dark:text-gray-400">{{ t('landing.progressWeek') }}</span>
                  <span class="font-semibold tabular-nums">{{ animatedScore }}%</span>
                </div>
                <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div class="h-full bg-secondary rounded-full animate-fill-bar-slow" style="--target-width: 68%"></div>
                </div>
              </div>

              <!-- Sessions appearing one by one -->
              <div class="space-y-2">
                <div
                  v-for="(session, i) in sessions"
                  :key="session.name"
                  class="flex items-center gap-3 p-2.5 rounded-lg border border-gray-100 dark:border-gray-800 opacity-0 animate-slide-in"
                  :style="{ animationDelay: `${i * 0.4 + 0.6}s` }"
                >
                  <span :class="['w-2 h-2 rounded-full shrink-0', session.color]"></span>
                  <span class="text-sm font-medium flex-1">{{ session.name }}</span>
                  <span class="text-xs text-gray-400">{{ session.time }}</span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Calendar :size="18" class="text-primary mb-2" />
                  <p class="text-xs text-gray-400">{{ t('landing.studySessions') }}</p>
                  <p class="text-sm font-semibold">{{ t('landing.optimizedByAI') }}</p>
                </div>
                <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <TrendingUp :size="18" class="text-secondary mb-2" />
                  <p class="text-xs text-gray-400">{{ t('landing.estimatedScore') }}</p>
                  <p class="text-sm font-semibold">+15% {{ t('landing.vsAverage') }}</p>
                </div>
              </div>
            </div>
          </AppCard>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="bg-primary/5 dark:bg-gray-900 py-12 border-y border-gray-200 dark:border-gray-800">
      <div class="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
        <div>
          <p class="text-3xl font-bold text-primary">20%</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ t('landing.statsTitle1') }}</p>
        </div>
        <div>
          <p class="text-3xl font-bold text-primary">10h</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ t('landing.statsTitle2') }}</p>
        </div>
        <div>
          <p class="text-3xl font-bold text-primary">100%</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ t('landing.statsTitle3') }}</p>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="max-w-6xl mx-auto px-6 py-20">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold mb-3">{{ t('landing.featuresTitle') }}</h2>
        <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {{ t('landing.featuresSubtitle') }}
        </p>
      </div>

      <div class="space-y-20">
        <!-- Feature 1 — image left -->
        <div class="grid md:grid-cols-2 gap-10 items-center">
          <img :src="pdfAnalysisImg" alt="" class="rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 w-full" />
          <div>
            <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <FileSearch :size="20" class="text-primary" />
            </div>
            <h3 class="text-2xl font-bold mb-3">{{ t('landing.feature1Title') }}</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">{{ t('landing.feature1Desc') }}</p>
            <ul class="space-y-2 text-sm">
              <li class="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Check :size="16" class="text-secondary shrink-0" /> {{ t('landing.feature1Point1') }}
              </li>
              <li class="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Check :size="16" class="text-secondary shrink-0" /> {{ t('landing.feature1Point2') }}
              </li>
              <li class="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Check :size="16" class="text-secondary shrink-0" /> {{ t('landing.feature1Point3') }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Feature 2 — image right -->
        <div class="grid md:grid-cols-2 gap-10 items-center">
          <div class="md:order-2">
            <img :src="dynamicPlanningImg" alt="" class="rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 w-full" />
          </div>
          <div class="md:order-1">
            <div class="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <CalendarClock :size="20" class="text-accent" />
            </div>
            <h3 class="text-2xl font-bold mb-3">{{ t('landing.feature2Title') }}</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">{{ t('landing.feature2Desc') }}</p>
            <ul class="space-y-2 text-sm">
              <li class="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Check :size="16" class="text-secondary shrink-0" /> {{ t('landing.feature2Point1') }}
              </li>
              <li class="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Check :size="16" class="text-secondary shrink-0" /> {{ t('landing.feature2Point2') }}
              </li>
              <li class="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Check :size="16" class="text-secondary shrink-0" /> {{ t('landing.feature2Point3') }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Feature 3 — image left -->
        <div class="grid md:grid-cols-2 gap-10 items-center">
          <img :src="catchupSystemImg" alt="" class="rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 w-full" />
          <div>
            <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Zap :size="20" class="text-primary" />
            </div>
            <h3 class="text-2xl font-bold mb-3">{{ t('landing.feature3Title') }}</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">{{ t('landing.feature3Desc') }}</p>
            <ul class="space-y-2 text-sm">
              <li class="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Check :size="16" class="text-secondary shrink-0" /> {{ t('landing.feature3Point1') }}
              </li>
              <li class="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Check :size="16" class="text-secondary shrink-0" /> {{ t('landing.feature3Point2') }}
              </li>
              <li class="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Check :size="16" class="text-secondary shrink-0" /> {{ t('landing.feature3Point3') }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works — connected timeline -->
    <section id="how" class="max-w-6xl mx-auto px-6 py-20">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold mb-3">{{ t('landing.howTitle') }}</h2>
        <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {{ t('landing.howSubtitle') }}
        </p>
      </div>

      <div class="relative grid md:grid-cols-4 gap-10 md:gap-6">
        <!-- connecting line -->
        <div class="hidden md:block absolute top-6 left-0 right-0 h-px bg-gray-200 dark:bg-gray-800"></div>

        <div
          v-for="(step, i) in steps"
          :key="step.title"
          class="relative"
        >
          <div class="relative z-10 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mb-4 ring-4 ring-gray-50 dark:ring-gray-950">
            {{ i + 1 }}
          </div>
          <h3 class="font-semibold mb-2">{{ step.title }}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">{{ step.desc }}</p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="max-w-6xl mx-auto px-6 pb-20">
      <div class="bg-primary rounded-2xl px-8 py-12 text-center text-white">
        <h2 class="text-3xl font-bold mb-3">{{ t('landing.ctaTitle') }}</h2>
        <p class="text-white/80 mb-2 max-w-xl mx-auto">{{ t('landing.ctaDesc') }}</p>
        <p class="text-white/60 text-sm mb-8">{{ t('landing.freeForever') }}</p>
        <AppButton size="lg" to="/register" class="!bg-white !text-primary hover:!bg-gray-100">
          {{ t('landing.ctaButton') }}
          <template #icon-right><ArrowRight :size="18" /></template>
        </AppButton>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-gray-200 dark:border-gray-800 py-8">
      <div class="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
        <span class="font-semibold text-gray-900 dark:text-white">Revix</span>
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
import AppButton from '@/shared/components/AppButton.vue'
import AppCard from '@/shared/components/AppCard.vue'
import ThemeToggle from '@/shared/components/ThemeToggle.vue'
import LanguageToggle from '@/shared/components/LanguageToggle.vue'
import AppLogo from '@/shared/components/AppLogo.vue'
import {
  Sparkles, ArrowRight, FileText, Calendar, TrendingUp,
  FileSearch, Check, CalendarClock, Zap
} from '@lucide/vue'

import pdfAnalysisImg from '@/assets/features/pdf-analysis.png'
import dynamicPlanningImg from '@/assets/features/dynamic-planning.png'
import catchupSystemImg from '@/assets/features/catchup-system.png'

const { t } = useI18n()

// Navbar shadow on scroll
const scrolled = ref(false)
function onScroll() {
  scrolled.value = window.scrollY > 8
}
onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

// Animated score counter
const animatedScore = ref(0)
onMounted(() => {
  const target = 68
  const duration = 1200
  const start = performance.now()
  function tick(now: number) {
    const progress = Math.min((now - start) / duration, 1)
    animatedScore.value = Math.round(progress * target)
    if (progress < 1) requestAnimationFrame(tick)
  }
  setTimeout(() => requestAnimationFrame(tick), 300)
})

// Mock sessions for the animated mockup
const sessions = [
  { name: 'MongoDB — Introduction', time: '09:00', color: 'bg-secondary' },
  { name: 'Algo — Tri rapide', time: '11:15', color: 'bg-primary' },
  { name: 'Réseaux — Couche IP', time: '14:00', color: 'bg-accent' }
]

// "How it works" steps, built from i18n
const steps = computed(() => [
  { title: t('landing.step1Title'), desc: t('landing.step1Desc') },
  { title: t('landing.step2Title'), desc: t('landing.step2Desc') },
  { title: t('landing.step3Title'), desc: t('landing.step3Desc') },
  { title: t('landing.step4Title'), desc: t('landing.step4Desc') }
])
</script>