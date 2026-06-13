import { IChapter } from '../modules/subject/subject.model'

// Convertit le niveau de maîtrise en score numérique
function masteryToScore(level: string): number {
  switch (level) {
    case 'not_understood': return 3  // priorité maximale
    case 'average':        return 2
    case 'mastered':       return 1  // priorité minimale
    default:               return 2
  }
}

// Convertit la difficulté en score numérique
function difficultyToScore(level: string): number {
  switch (level) {
    case 'high':   return 3
    case 'medium': return 2
    case 'low':    return 1
    default:       return 2
  }
}

// Calcule à quel point l'examen est proche (plus c'est proche, plus le score monte)
function proximityScore(examDate: Date): number {
  const today = new Date()
  const daysLeft = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (daysLeft <= 3)  return 5
  if (daysLeft <= 7)  return 4
  if (daysLeft <= 14) return 3
  if (daysLeft <= 21) return 2
  return 1
}

// Score final = combinaison de tous les facteurs
export function computePriorityScore(chapter: IChapter, examDate: Date): number {
  const mastery   = masteryToScore(chapter.masteryLevel)   // 1-3
  const difficulty= difficultyToScore(chapter.difficulty)  // 1-3
  const importance= chapter.importanceScore                // 1-5
  const proximity = proximityScore(examDate)               // 1-5

  // Formule : chaque facteur a un poids différent
  return (mastery * 3) + (difficulty * 2) + importance + (proximity * 2)
}

// Calcule la durée recommandée d'une session selon le niveau
export function recommendedDuration(chapter: IChapter): number {
  const mastery = masteryToScore(chapter.masteryLevel)
  const difficulty = difficultyToScore(chapter.difficulty)
  const base = 60 // 60 minutes de base

  // Plus c'est difficile et moins c'est maîtrisé → plus de temps
  return base + (mastery * 15) + (difficulty * 10)
}
