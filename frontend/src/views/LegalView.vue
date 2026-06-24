<template>
  <component :is="authStore.isAuthenticated ? AppLayout : 'div'" v-bind="layoutProps">
    <div class="min-h-screen bg-surface dark:bg-ink-950 text-gray-900 dark:text-gray-100">
      <div v-if="!authStore.isAuthenticated" class="border-b border-surface-border dark:border-ink-700 bg-white dark:bg-ink-950">
        <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <RouterLink to="/">
            <AppLogo size="xl" />
          </RouterLink>
          <RouterLink to="/privacy" class="min-h-[44px] inline-flex items-center text-sm font-semibold text-primary-soft hover:text-primary">
            Confidentialite
          </RouterLink>
        </div>
      </div>

      <main class="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <article class="bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-2xl p-5 md:p-8 shadow-sm space-y-7">
          <header class="space-y-2">
            <p class="text-sm font-mono text-primary-soft">Derniere mise a jour : 24 juin 2026</p>
            <h1 class="font-display text-2xl md:text-3xl font-bold tracking-tight">Conditions Generales d'Utilisation</h1>
            <p class="text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
              Ces conditions encadrent l'utilisation de Revix, une plateforme gratuite de revision intelligente concue pour aider les etudiants a organiser, comprendre et reviser leurs cours.
            </p>
          </header>

          <section v-for="section in sections" :key="section.title" class="space-y-3">
            <h2 class="font-display text-lg md:text-xl font-bold">{{ section.title }}</h2>
            <p v-for="paragraph in section.paragraphs" :key="paragraph" class="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              {{ paragraph }}
            </p>
          </section>
        </article>
      </main>
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import AppLayout from '@/shared/components/AppLayout.vue'
import AppLogo from '@/shared/components/AppLogo.vue'
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()
const layoutProps = computed(() => authStore.isAuthenticated
  ? { title: 'CGU', subtitle: 'Conditions Generales d\'Utilisation' }
  : {}
)

const sections = [
  {
    title: '1. Presentation du service',
    paragraphs: [
      'Revix est un service gratuit qui aide les etudiants a transformer leurs supports de cours en outils de revision : analyse de PDF, fiches de revision, quiz, planning de revision et assistant conversationnel IA.',
      'Le service vise principalement les etudiants algeriens, mais peut etre utilise par tout utilisateur disposant d\'un compte valide.'
    ]
  },
  {
    title: '2. Acceptation des conditions',
    paragraphs: [
      'En creant un compte ou en utilisant Revix, vous acceptez les presentes conditions. Si vous n\'etes pas d\'accord avec elles, vous devez cesser d\'utiliser le service.',
      'Vous devez utiliser Revix dans le respect des lois applicables, des droits des tiers et des regles de votre etablissement.'
    ]
  },
  {
    title: '3. Description du service',
    paragraphs: [
      'Revix permet notamment d\'importer des fichiers PDF de cours, d\'extraire et d\'analyser leur contenu, de generer des flashcards, de creer des quiz, d\'organiser un planning de revision et de poser des questions a un chatbot IA.',
      'Les fonctionnalites IA reposent sur des modeles externes, notamment Groq/Llama. Les reponses peuvent etre utiles pour reviser, mais elles ne remplacent pas un enseignant, un manuel officiel ou vos propres verifications.'
    ]
  },
  {
    title: '4. Compte utilisateur',
    paragraphs: [
      'Certaines fonctionnalites necessitent un compte. Vous devez fournir des informations exactes et garder vos identifiants confidentiels.',
      'Vous etes responsable des actions effectuees depuis votre compte. En cas d\'acces non autorise suspecte, contactez Revix rapidement.'
    ]
  },
  {
    title: '5. Utilisation acceptable',
    paragraphs: [
      'Vous vous engagez a ne pas televerser de contenus illicites, malveillants, diffamatoires, discriminatoires, portant atteinte aux droits d\'autrui ou contenant des donnees sensibles que vous n\'etes pas autorise a traiter.',
      'Il est interdit de tenter de perturber le service, contourner les limitations techniques, extraire massivement des donnees ou utiliser Revix pour produire de la fraude academique.'
    ]
  },
  {
    title: '6. Propriete intellectuelle',
    paragraphs: [
      'Vous conservez vos droits sur les cours, documents et contenus que vous importez. Vous garantissez disposer des droits necessaires pour les utiliser dans Revix.',
      'L\'interface, le code, la marque Revix et les elements propres au service restent la propriete de leurs titulaires. Les contenus generes par l\'IA sont fournis comme aide de revision et doivent etre verifies avant reutilisation.'
    ]
  },
  {
    title: '7. Limitation de responsabilite',
    paragraphs: [
      'Revix est fourni gratuitement, sans garantie de disponibilite permanente, d\'absence d\'erreur ou d\'adequation parfaite a un examen precis.',
      'Les analyses IA, flashcards, quiz, plannings et reponses du chatbot peuvent contenir des erreurs, omissions ou approximations. Vous restez responsable de vos decisions, revisions et resultats academiques.'
    ]
  },
  {
    title: '8. Modifications des CGU',
    paragraphs: [
      'Revix peut modifier ces conditions pour tenir compte de l\'evolution du service, des contraintes techniques ou du cadre legal. La date de mise a jour indique la version applicable.',
      'L\'utilisation du service apres publication d\'une nouvelle version vaut acceptation des conditions modifiees.'
    ]
  },
  {
    title: '9. Contact',
    paragraphs: [
      'Pour toute question relative aux presentes conditions, vous pouvez contacter Revix a l\'adresse revix26@gmail.com.'
    ]
  }
]
</script>
