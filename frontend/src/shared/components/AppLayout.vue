<script setup>
import Sidebar from './components/AppSidebar.vue'
import Header from './components/AppHeader.vue'
</script>

<template>
  <div class="min-h-screen bg-[#0b0f19] text-white font-sans antialiased">
    <!-- Notre Sidebar fixe à gauche -->
    <Sidebar />

    <!-- Conteneur global de droite (prend tout le reste de l'écran) -->
    <div class="pl-64 flex flex-col min-h-screen">
      <!-- Notre Header fixe en haut -->
      <Header />

      <!-- Zone centrale de Contenu (Main Content) -->
      <!-- On applique un padding-top de pt-20 pour ne pas être caché derrière le header fixe -->
      <main class="flex-1 p-8 pt-28 flex justify-center items-center">
        
        <!-- C'est ici que vient se loger ton formulaire Onboarding / Stepper actuel -->
        <div class="w-full max-w-4xl">
          <!-- Ton composant Stepper ou ta vue actuelle -->
          <slot>
            <!-- Contenu temporaire ou routeur-view -->
          </slot>
        </div>

      </main>
    </div>
  </div>
</template>