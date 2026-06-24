export type Locale = 'fr' | 'en'

type MessageEntry = { fr: string; en: string }
type Messages = Record<string, MessageEntry>

const messages: Messages = {
  // ── Auth ──────────────────────────────────────────────────────────────────
  'auth.firstNameTooShort': { fr: 'Prénom trop court', en: 'First name too short' },
  'auth.lastNameTooShort': { fr: 'Nom trop court', en: 'Last name too short' },
  'auth.invalidEmail': { fr: 'Email invalide', en: 'Invalid email' },
  'auth.passwordMinLength': { fr: 'Mot de passe minimum 8 caractères', en: 'Password must be at least 8 characters' },
  'auth.passwordWeak': { fr: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial', en: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character' },
  'auth.passwordRequired': { fr: 'Mot de passe requis', en: 'Password required' },
  'auth.currentPasswordRequired': { fr: 'Mot de passe actuel requis', en: 'Current password required' },
  'auth.newPasswordMinLength': { fr: 'Le nouveau mot de passe doit contenir au moins 8 caractères', en: 'The new password must be at least 8 characters' },
  'auth.emailAlreadyUsed': { fr: 'Cet email est déjà utilisé', en: 'This email is already in use' },
  'auth.invalidCredentials': { fr: 'Email ou mot de passe incorrect', en: 'Incorrect email or password' },
  'auth.userNotFound': { fr: 'Utilisateur introuvable', en: 'User not found' },
  'auth.googleAccountCannotChangePassword': { fr: 'Les comptes connectés via Google ne peuvent pas changer de mot de passe ici', en: 'Accounts linked via Google cannot change their password here' },
  'auth.currentPasswordIncorrect': { fr: 'Mot de passe actuel incorrect', en: 'Current password is incorrect' },
  'auth.passwordUpdated': { fr: 'Mot de passe mis à jour avec succès', en: 'Password updated successfully' },
  'auth.tokenMissing': { fr: 'Token manquant', en: 'Token missing' },
  'auth.tokenInvalid': { fr: 'Token invalide ou expiré', en: 'Invalid or expired token' },
  'auth.tooManyAttempts': { fr: 'Trop de tentatives. Réessayez dans quelques minutes.', en: 'Too many attempts. Please try again in a few minutes.' },
  'auth.resetEmailSentIfExists': { fr: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.', en: 'If an account exists with this email, a reset link has been sent.' },
  'auth.resetTokenRequired': { fr: 'Token requis', en: 'Token required' },
  'auth.resetTokenInvalid': { fr: 'Lien de réinitialisation invalide ou expiré', en: 'Invalid or expired reset link' },

  // ── Subject / Chapter ────────────────────────────────────────────────────
  'subject.nameRequired': { fr: 'Nom requis', en: 'Name required' },
  'subject.invalidDate': { fr: 'Date invalide', en: 'Invalid date' },
  'subject.titleRequired': { fr: 'Titre requis', en: 'Title required' },
  'subject.notFound': { fr: 'Module introuvable', en: 'Module not found' },
  'subject.deleted': { fr: 'Module supprimé', en: 'Module deleted' },
  'chapter.notFound': { fr: 'Chapitre introuvable', en: 'Chapter not found' },

  // ── Document ──────────────────────────────────────────────────────────────
  'document.notFound': { fr: 'Document introuvable', en: 'Document not found' },
  'document.deleted': { fr: 'Document supprimé', en: 'Document deleted' },
  'document.subjectAndFileNameRequired': { fr: 'subjectId et fileName sont requis', en: 'subjectId and fileName are required' },

  // ── Flashcard / Quiz ──────────────────────────────────────────────────────
  'flashcard.subjectAndTextRequired': { fr: 'subjectId et text sont requis', en: 'subjectId and text are required' },
  'flashcard.noPdfReceived': { fr: 'Aucun fichier PDF reçu', en: 'No PDF file received' },
  'flashcard.subjectIdRequired': { fr: 'subjectId est requis', en: 'subjectId is required' },
  'flashcard.notFound': { fr: 'Flashcard introuvable', en: 'Flashcard not found' },
  'flashcard.deleted': { fr: 'Flashcard supprimée', en: 'Flashcard deleted' },
  'quiz.notFound': { fr: 'Quiz introuvable', en: 'Quiz not found' },
  'quiz.deleted': { fr: 'Quiz supprimé', en: 'Quiz deleted' },
  'quiz.answersArrayRequired': { fr: 'answers (array) est requis', en: 'answers (array) is required' },
  

  // ── PDF ───────────────────────────────────────────────────────────────────
  'pdf.noFileReceived': { fr: 'Aucun fichier PDF reçu', en: 'No PDF file received' },
  'pdf.subjectAndChaptersRequired': { fr: 'subjectId et chapters (array) sont requis', en: 'subjectId and chapters (array) are required' },
  'pdf.aiInvalidJson': { fr: "L'IA n'a pas retourné un JSON valide. Réessayez.", en: 'The AI did not return valid JSON. Please try again.' },
  'pdf.onlyPdfAccepted': { fr: 'Seuls les fichiers PDF sont acceptés', en: 'Only PDF files are accepted' },
  'pdf.chaptersDetectedMessage': { fr: 'Nous avons détecté {count} chapitres — vous pouvez modifier avant de confirmer', en: 'We detected {count} chapters — you can edit them before confirming' },
  'pdf.chaptersImportedMessage': { fr: '{count} chapitres importés avec succès', en: '{count} chapters imported successfully' },
  'pdf.rateLimitExceeded': { fr: "Limite d'analyse IA atteinte pour aujourd'hui. Réessayez dans quelques heures.", en: 'Daily AI analysis limit reached. Please try again in a few hours.' },

  // ── Planning ──────────────────────────────────────────────────────────────
  'planning.availableDaysAndHoursRequired': { fr: 'availableDays et hoursPerDay sont requis', en: 'availableDays and hoursPerDay are required' },
  'planning.invalidStatus': { fr: 'Status invalide. Utiliser: completed ou missed', en: 'Invalid status. Use: completed or missed' },
  'planning.weekStartRequired': { fr: 'weekStart requis', en: 'weekStart required' },
  'planning.noSubjectsFound': { fr: "Aucun module trouvé. Ajoutez des modules d'abord.", en: 'No modules found. Add modules first.' },
  'planning.noChaptersFound': { fr: 'Aucun chapitre trouvé. Ajoutez des chapitres à vos modules.', en: 'No chapters found. Add chapters to your modules.' },
  'planning.cannotGenerate': { fr: 'Impossible de générer un planning. Vérifiez vos disponibilités.', en: 'Unable to generate a schedule. Check your availability.' },
  'planning.noneGenerated': { fr: 'Aucun planning généré', en: 'No schedule generated' },
  'planning.noneFound': { fr: 'Aucun planning trouvé', en: 'No schedule found' },
  'planning.sessionNotFound': { fr: 'Session introuvable', en: 'Session not found' },
  'planning.noMissedToReschedule': { fr: 'Aucune session ratée à rattraper', en: 'No missed session to reschedule' },
  'planning.sessionFieldsRequired': { fr: 'date, startTime et durationMinutes sont requis', en: 'date, startTime and durationMinutes are required' },
  'planning.sessionTitleRequired': { fr: 'Choisissez un chapitre existant ou entrez un titre', en: 'Choose an existing chapter or enter a title' },

  // ── Générique ─────────────────────────────────────────────────────────────
  'common.unexpectedError': { fr: 'Une erreur est survenue', en: 'An error occurred' },
  // ── Chat ────────────────────────────────────────────────────────────────
  'chat.questionRequired': { fr: 'Question requise', en: 'Question required' },
'chat.questionTooLong': { fr: 'Question trop longue (max 2000 caractères)', en: 'Question too long (max 2000 characters)' },
'chat.historyCleared': { fr: 'Historique effacé', en: 'History cleared' },
}

/**
 * Traduit une clé de message. Si la clé n'existe pas dans le dictionnaire
 * (ex: message d'erreur Mongoose imprévu), elle est renvoyée telle quelle
 * pour ne jamais perdre d'information.
 */
export function t(key: string, locale: Locale = 'fr', params?: Record<string, string | number>): string {
  const entry = messages[key]
  if (!entry) return key

  let text = entry[locale] ?? entry.fr
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{${k}}`, String(v))
    }
  }
  return text
}

/** Traduit un tableau d'erreurs Zod (chaque issue a un champ `message` qui est une clé) */
export function translateZodErrors(errors: { message: string; [key: string]: any }[], locale: Locale) {
  return errors.map(e => ({ ...e, message: t(e.message, locale) }))
}
