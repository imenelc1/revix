<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <header class="h-20 bg-[#0b0f19]/80 backdrop-blur-md border-b border-slate-900/60 flex items-center justify-between px-8 fixed top-0 right-0 left-64 z-10">
    <!-- Titre de la page actuelle -->
    <div>
      <h2 class="text-white font-semibold text-lg">{{ t('onboarding.addModuleTitle') }}</h2>
    </div>

    <!-- Actions à droite -->
    <div class="flex items-center gap-6">
      <!-- Badge de Score Global -->
      <div class="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
        <span class="text-xs font-medium text-emerald-400 tracking-wide">
          {{ t('onboarding.globalScore') }} <strong class="font-bold">85%</strong>
        </span>
      </div>

      <!-- Boutons d'outils Quick Actions -->
      <div class="flex items-center gap-4 text-slate-400">
        <button class="hover:text-white transition-colors">
          <!-- Icône Cloche Notification -->
          <span class="block w-5 h-5 rounded-full border-2 border-current"></span>
        </button>
        <button class="hover:text-white transition-colors">
          <!-- Icône Paramètres -->
          <span class="block w-5 h-5 rounded-full border-2 border-current"></span>
        </button>
      </div>

      <!-- Profil Utilisateur -->
      <div class="flex items-center gap-3 pl-2 border-l border-slate-800">
        <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border border-slate-700 overflow-hidden flex items-center justify-center text-white text-xs font-bold">
          IM
        </div>
      </div>
    </div>
  </header>
</template>