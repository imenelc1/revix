<template>
  <component :is="authStore.isAuthenticated ? AppLayout : 'div'" v-bind="layoutProps">
    <div class="min-h-screen bg-surface dark:bg-ink-950 text-gray-900 dark:text-gray-100">
      <div v-if="!authStore.isAuthenticated" class="border-b border-surface-border dark:border-ink-700 bg-white dark:bg-ink-950">
        <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <RouterLink to="/">
            <AppLogo size="xl" />
          </RouterLink>
          <RouterLink to="/legal" class="min-h-[44px] inline-flex items-center text-sm font-semibold text-primary-soft hover:text-primary">
            CGU
          </RouterLink>
        </div>
      </div>

      <main class="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <article class="bg-white dark:bg-ink-800 border border-surface-border dark:border-ink-600 rounded-2xl p-5 md:p-8 shadow-sm space-y-7">
          <header class="space-y-2">
            <p class="text-sm font-mono text-primary-soft">Derniere mise a jour : 24 juin 2026</p>
            <h1 class="font-display text-2xl md:text-3xl font-bold tracking-tight">Politique de Confidentialite</h1>
            <p class="text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
              Cette politique explique quelles donnees Revix collecte, pourquoi elles sont utilisees et quels droits vous pouvez exercer.
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
  ? { title: 'Confidentialite', subtitle: 'Politique de Confidentialite' }
  : {}
)

const sections = [
  {
    title: '1. Donnees collectees',
    paragraphs: [
      'Revix collecte les informations necessaires a la creation et a la gestion de votre compte : prenom, nom, adresse email, mot de passe chiffre ou identifiant Google OAuth lorsque vous utilisez la connexion Google.',
      'Revix collecte aussi les donnees pedagogiques que vous ajoutez : noms de modules, dates d\'examen, chapitres, niveaux de maitrise, plannings, messages de chat et contenu extrait des cours ou PDF televerses.'
    ]
  },
  {
    title: '2. Utilisation des donnees',
    paragraphs: [
      'Vos donnees servent a fournir les fonctionnalites de Revix : authentification, sauvegarde de vos modules, analyse de PDF, generation de flashcards et quiz, creation de planning, historique de chat et personnalisation de l\'experience.',
      'Les donnees peuvent aussi etre utilisees pour securiser le service, corriger des bugs, prevenir les abus et ameliorer la fiabilite technique de la plateforme.'
    ]
  },
  {
    title: '3. Stockage et hebergement',
    paragraphs: [
      'Les donnees applicatives sont stockees dans MongoDB Atlas. Le backend est heberge sur Render et le frontend sur Netlify.',
      'Les mots de passe sont stockes sous forme de hash. Les cookies d\'authentification sont configures en HttpOnly afin de limiter leur exposition au JavaScript cote client.'
    ]
  },
  {
    title: '4. Partage avec des tiers',
    paragraphs: [
      'Pour fournir les fonctionnalites IA, Revix peut transmettre a l\'API Groq le contenu necessaire a l\'analyse, notamment des extraits de cours televerses, des questions de chat ou le contexte pedagogique utile.',
      'Revix ne vend pas vos donnees personnelles. Des prestataires techniques comme MongoDB Atlas, Render, Netlify, Google OAuth et Groq peuvent traiter certaines donnees uniquement pour fournir leur service.'
    ]
  },
  {
    title: '5. Cookies',
    paragraphs: [
      'Revix utilise un cookie HttpOnly pour maintenir votre session d\'authentification. Ce cookie est necessaire au fonctionnement du compte utilisateur.',
      'A ce stade, Revix ne repose pas sur des cookies publicitaires ni sur de la facturation. Le service est gratuit.'
    ]
  },
  {
    title: '6. Duree de conservation',
    paragraphs: [
      'Les donnees sont conservees tant que votre compte existe ou tant qu\'elles sont necessaires au fonctionnement du service.',
      'Vous pouvez demander la suppression de vos donnees. Certaines traces techniques minimales peuvent etre conservees temporairement pour des raisons de securite ou d\'obligations legales.'
    ]
  },
  {
    title: '7. Droits des utilisateurs',
    paragraphs: [
      'Vous pouvez demander l\'acces, la rectification, l\'export ou la suppression de vos donnees personnelles et pedagogiques.',
      'Vous pouvez egalement demander des informations sur les traitements effectues ou retirer votre utilisation du service en cessant de l\'utiliser et en demandant la suppression de votre compte.'
    ]
  },
  {
    title: '8. Securite',
    paragraphs: [
      'Revix applique des mesures raisonnables de securite : chiffrement des mots de passe, cookie HttpOnly, validation des entrees et separation des variables d\'environnement.',
      'Aucun systeme n\'est totalement invulnerable. Evitez de televerser des documents contenant des donnees sensibles sans necessite pedagogique.'
    ]
  },
  {
    title: '9. Contact',
    paragraphs: [
      'Pour exercer vos droits ou poser une question sur la confidentialite, contactez Revix a l\'adresse revix26@gmail.com.'
    ]
  }
]
</script>
