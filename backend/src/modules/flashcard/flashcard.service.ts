import { Flashcard, Quiz } from './flashcard.model'
import { groq } from '../../utils/groq.client'

export const flashcardService = {

  // Générer des flashcards via IA depuis un texte
  async generateFromText(userId: string, subjectId: string, text: string, chapterId?: string) {
    const prompt = `Tu es un assistant pédagogique. Génère des flashcards de révision à partir de ce contenu.

Contenu :
"""
${text.slice(0, 12000)}
"""

Réponds UNIQUEMENT avec un JSON valide (sans markdown) :
{
  "flashcards": [
    { "question": "Question claire ?", "answer": "Réponse concise" }
  ]
}

Génère entre 10 et 15 flashcards couvrant l'ensemble du contenu, pas seulement le début.`

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      max_tokens: 3000
    })

    const content = response.choices[0]?.message?.content || ''
    const cleaned = content.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned)

    // Sauvegarder en base
    const flashcards = await Flashcard.insertMany(
      parsed.flashcards.map((f: any) => ({
        userId,
        subjectId,
        chapterId: chapterId || undefined,
        question: f.question,
        answer: f.answer
      }))
    )

    return flashcards
  },

  // Récupérer toutes les flashcards d'un module
  async getBySubject(userId: string, subjectId: string) {
    return Flashcard.find({ userId, subjectId }).sort({ createdAt: -1 })
  },

  // Supprimer une flashcard
 async delete(userId: string, flashcardId: string) {
  const card = await Flashcard.findOneAndDelete({ _id: flashcardId, userId })
  if (!card) throw new Error('flashcard.notFound')
  return { message: 'flashcard.deleted' }
},

  // Générer un quiz via IA depuis un texte
  async generateQuiz(userId: string, subjectId: string, text: string, chapterId?: string) {
    const prompt = `Tu es un assistant pédagogique. Génère un quiz de 5 questions à choix multiples.

Contenu :
"""
${text.slice(0, 12000)}
"""

Réponds UNIQUEMENT avec un JSON valide (sans markdown) :
{
  "questions": [
    {
      "question": "Question ?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Explication de la bonne réponse"
    }
  ]
}

Génère entre 8 et 10 questions couvrant l'ensemble du contenu. correctIndex est l'index (0-3) de la bonne réponse.`

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      max_tokens: 2000
    })

    const content = response.choices[0]?.message?.content || ''
    const cleaned = content.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned)

    const quiz = await Quiz.create({
      userId,
      subjectId,
      chapterId: chapterId || undefined,
      questions: parsed.questions
    })

    return quiz
  },

  // Récupérer les quiz d'un module
  async getQuizBySubject(userId: string, subjectId: string) {
  return Quiz.find({ userId, subjectId })
    .select('-questions.correctIndex -questions.explanation')
    .sort({ createdAt: -1 })
},
async getQuizById(userId: string, quizId: string) {
  const quiz = await Quiz.findOne({ _id: quizId, userId })
  if (!quiz) throw new Error('quiz.notFound')
  return quiz
},
    async deleteQuiz(userId: string, quizId: string) {
    const quiz = await Quiz.findOneAndDelete({ _id: quizId, userId })
    if (!quiz) throw new Error('quiz.notFound')
    return { message: 'quiz.deleted' }
  },

  // Soumettre les réponses d'un quiz et calculer le score
  async submitQuiz(userId: string, quizId: string, answers: number[]) {
    const quiz = await Quiz.findOne({ _id: quizId, userId })
    if (!quiz) throw new Error('quiz.notFound')

    let correct = 0
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctIndex) correct++
    })

    const score = Math.round((correct / quiz.questions.length) * 100)
    quiz.userScore = score
    await quiz.save()

    return {
      score,
      correct,
      total: quiz.questions.length,
      details: quiz.questions.map((q, i) => ({
        question: q.question,
        yourAnswer: q.options[answers[i]],
        correctAnswer: q.options[q.correctIndex],
        isCorrect: answers[i] === q.correctIndex,
        explanation: q.explanation
      }))
    }
  }
}
