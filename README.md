# Revix

[![Build](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![Vue](https://img.shields.io/badge/Vue-3-42b883)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-3178c6)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-ISC-blue)](./backend/package.json)

Revix est une plateforme de revision intelligente pour etudiants. Elle transforme les cours et supports PDF en outils de travail concrets : modules, chapitres, flashcards, quiz, planning de revision et assistant IA contextualise.

Demo : https://revix-app.netlify.app

## Stack Technique

- Frontend : Vue 3, TypeScript, Vite, Pinia, Vue Router, Tailwind CSS
- Backend : Node.js, Express, TypeScript, Mongoose
- Base de donnees : MongoDB Atlas
- IA : Groq API avec Llama 3.3
- Authentification : JWT en cookie HttpOnly, Google OAuth
- Deploiement : Netlify pour le frontend, Render pour l'API

## Fonctionnalites

- Authentification email/mot de passe et Google OAuth
- Politique de mot de passe renforcee : minimum 8 caracteres, une majuscule, une minuscule, un chiffre et un caractere special
- Mot de passe oublié avec lien de réinitialisation par email via Resend
- Creation de modules avec dates d'examen, chapitres, difficulte et niveau de maitrise
- Analyse de PDF pour extraire des chapitres et contenus de revision
- Generation de flashcards et quiz a partir des cours
- Planning de revision intelligent avec sessions, rattrapage et score de preparation
- Ajout manuel de seances dans le planning, avec ou sans module, puis modification et suppression
- Chatbot IA capable de repondre avec le contexte des cours uploades
- Interface responsive, dark mode et support FR/EN

## Architecture

```text
revix/
├── frontend/
│   ├── src/
│   │   ├── assets/              # Logos et visuels
│   │   ├── features/            # Composants metier par domaine
│   │   ├── locales/             # Traductions FR/EN
│   │   ├── router/              # Routes et guards
│   │   ├── shared/              # Composants, utils et composables partages
│   │   ├── stores/              # Stores Pinia
│   │   └── views/               # Pages applicatives
│   └── netlify.toml
├── backend/
│   ├── src/
│   │   ├── config/              # Env, DB, Google OAuth
│   │   ├── middlewares/         # Auth, erreurs, locale, rate limit
│   │   ├── modules/             # Auth, subjects, planning, PDF, flashcards, chat
│   │   └── utils/               # Client Groq, i18n, scoring
│   └── render.yaml
└── README.md
```

## Installation Locale

### Prerequis

- Node.js 20+
- npm
- MongoDB local ou MongoDB Atlas
- Une cle Groq API
- Identifiants Google OAuth si la connexion Google est activee
- Une clé API Resend si vous voulez envoyer les emails de mot de passe oublié 

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

L'API demarre par defaut sur `http://localhost:3000`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

L'application demarre par defaut sur `http://localhost:5173`.

## Variables D'environnement

### Backend

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/revix
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d
SESSION_SECRET=change_this_to_a_different_long_random_string
GROQ_API_KEY=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

FRONTEND_URL=http://localhost:5173
FRONTEND_URLS=http://localhost:5173
NODE_ENV=development
RESEND_API_KEY=
```

Details :

- `MONGODB_URI` : URL de connexion MongoDB locale ou Atlas.
- `JWT_SECRET` et `SESSION_SECRET` : valeurs longues, aleatoires et differentes en production.
- `GROQ_API_KEY` : cle API Groq utilisee pour les fonctionnalites IA.
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL` : requis seulement pour Google OAuth.
- `FRONTEND_URL` : URL principale du frontend, utilisee notamment pour generer les liens de reset password.
- `FRONTEND_URLS` : liste d'origines autorisees CORS, separees par des virgules si besoin.
- `RESEND_API_KEY ` : clé API Resend utilisée pour l'envoi des emails (mot de passe oublié, emails système).
### Frontend

```env
VITE_API_URL=
```

Ne committez jamais de fichier `.env` contenant des valeurs reelles. Utilisez uniquement les fichiers `.env.example` comme documentation.

## Planning Manuel

Depuis la page Planning, l'utilisateur peut cliquer sur `Ajouter une seance`.

- Pour une seance libre, laisser `Aucun module`, saisir un titre, choisir la date, l'heure et la duree.
- Pour une seance liee aux cours, choisir un module puis un chapitre ou saisir un titre personnalise.
- Les seances peuvent ensuite etre modifiees avec le bouton crayon, supprimees avec le bouton poubelle, marquees terminees ou marquees ratees.

## Scripts Utiles

Backend :

```bash
npm run dev
npm run build
npm start
```

Frontend :

```bash
npm run dev
npm run build
npm run preview
```

## Securite Et Confidentialite

Revix traite des contenus de cours uploades par les utilisateurs. Ces contenus peuvent etre transmis a Groq API pour fournir les fonctionnalites IA. Les utilisateurs doivent eviter d'importer des documents contenant des donnees sensibles sans necessite pedagogique.

Les tokens d'authentification sont envoyes via cookie HttpOnly. Les secrets de production doivent etre configures dans Render, Netlify ou le gestionnaire de secrets de l'environnement cible.

## Licence

Ce projet est distribue sous licence ISC, conformement aux fichiers `package.json`.
