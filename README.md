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
- Creation de modules avec dates d'examen, chapitres, difficulte et niveau de maitrise
- Analyse de PDF pour extraire des chapitres et contenus de revision
- Generation de flashcards et quiz a partir des cours
- Planning de revision intelligent avec sessions, rattrapage et score de preparation
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
PORT=
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=
SESSION_SECRET=
GROQ_API_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
FRONTEND_URL=
FRONTEND_URLS=
NODE_ENV=
```

### Frontend

```env
VITE_API_URL=
```

Ne committez jamais de fichier `.env` contenant des valeurs reelles. Utilisez uniquement les fichiers `.env.example` comme documentation.

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
