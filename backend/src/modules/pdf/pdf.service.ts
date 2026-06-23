import fs from 'fs'
import { groq } from '../../utils/groq.client'
import { Subject } from '../subject/subject.model'

// Import CommonJS compatible
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfParse = require('pdf-parse')

export const pdfService = {

 async extractText(filePath: string): Promise<string> {
  const buffer = fs.readFileSync(filePath)
  const data = await pdfParse(buffer)
  const text = data.text
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 20000)
  return text
},
  async analyzeWithAI(text: string) {
    const prompt = `Tu es un assistant pédagogique. Analyse ce cours universitaire et extrait les informations suivantes.

Texte du cours :
"""
${text}
"""

Réponds UNIQUEMENT avec un JSON valide (sans markdown, sans explication) dans ce format exact :
{
  "chapters": [
    {
      "title": "Titre du chapitre",
      "keyConcepts": ["concept1", "concept2", "concept3"],
      "estimatedDifficulty": "low",
      "summary": "Résumé en 1-2 phrases"
    }
  ],
  "subjectName": "Nom probable de la matière",
  "totalChapters": 3
}`

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 2000
    })

    const content = response.choices[0]?.message?.content || ''

    try {
      const cleaned = content.replace(/```json|```/g, '').trim()
      return JSON.parse(cleaned)
    } catch {
  throw new Error('pdf.aiInvalidJson')
}
  },

  async generateFlashcards(text: string) {
    const prompt = `Tu es un assistant pédagogique. À partir de ce cours, génère des fiches de révision.

Texte :
"""
${text}
"""

Réponds UNIQUEMENT avec un JSON valide (sans markdown) dans ce format exact :
{
  "summary": "Résumé structuré du cours en 3-5 points clés",
  "flashcards": [
    { "question": "Question ?", "answer": "Réponse claire et concise" }
  ],
  "quiz": [
    {
      "question": "Question ?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Explication de la bonne réponse"
    }
  ]
}

Génère exactement 5 flashcards et exactement 5 questions de quiz.`

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      max_tokens: 3000
    })

    const content = response.choices[0]?.message?.content || ''

    try {
      const cleaned = content.replace(/```json|```/g, '').trim()
      return JSON.parse(cleaned)
    } catch {
  throw new Error('pdf.aiInvalidJson')
}
  },

  async importChapters(userId: string, subjectId: string, chapters: any[]) {
    const subject = await Subject.findOne({ _id: subjectId, userId })
    if (!subject) throw new Error('subject.notFound')

    for (const chapter of chapters) {
      subject.chapters.push({
        title: chapter.title,
        masteryLevel: 'average',
        difficulty: chapter.estimatedDifficulty || 'medium',
        importanceScore: 3,
        covered: false
      })
    }

    await subject.save()
    return subject
  },

  cleanup(filePath: string) {
    try {
      fs.unlinkSync(filePath)
    } catch {}
  }
}
