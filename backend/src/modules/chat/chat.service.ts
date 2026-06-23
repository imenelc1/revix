import { ChatMessage } from './chat.model'
import { Subject } from '../subject/subject.model'
import { CourseDocument } from '../document/document.model'
import { groq } from '../../utils/groq.client'

const MAX_CONTEXT_CHARS = 18000
const HISTORY_LIMIT = 10

export const chatService = {

  async ask(userId: string, subjectId: string, question: string) {
    const subject = await Subject.findOne({ _id: subjectId, userId })
    if (!subject) throw new Error('subject.notFound')

    const documents = await CourseDocument.find({ userId, subjectId }).sort({ uploadedAt: -1 })
    const docsWithText = documents.filter(d => d.extractedText && d.extractedText.trim().length > 0)

    let context = ''
    if (docsWithText.length > 0) {
      const budgetPerDoc = Math.floor(MAX_CONTEXT_CHARS / docsWithText.length)
      context = docsWithText
        .map(d => `--- Document : ${d.fileName} ---\n${d.extractedText.slice(0, budgetPerDoc)}`)
        .join('\n\n')
    }

    const chaptersList = subject.chapters.map(c => `- ${c.title} (${c.masteryLevel})`).join('\n')

    const systemPrompt = `Tu es un assistant pédagogique qui aide un étudiant à comprendre le module "${subject.name}".

Chapitres du module :
${chaptersList || 'Aucun chapitre renseigné.'}

${context ? `Contenu des documents de cours fournis :\n${context}` : "Aucun document de cours n'a été importé pour ce module — réponds en te basant sur tes connaissances générales et précise-le à l'étudiant."}

Règles :
- Réponds uniquement en te basant sur le contenu fourni ci-dessus quand il existe.
- Si la réponse ne se trouve pas dans le contenu fourni, dis-le honnêtement plutôt que d'inventer.
- Sois concis, clair et pédagogique.`

    const recentHistory = await ChatMessage.find({ userId, subjectId })
      .sort({ createdAt: -1 })
      .limit(HISTORY_LIMIT)
      .then(msgs => msgs.reverse())

    const messages = [
      { role: 'system', content: systemPrompt },
      ...recentHistory.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: question }
    ]

    let response
try {
  response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: messages as any,
    temperature: 0.3,
    max_tokens: 1200
  })
} catch (err: any) {
  if (err.message?.includes('429') || err.message?.includes('rate_limit_exceeded')) {
    throw new Error('pdf.rateLimitExceeded')
  }
  throw err
}

    const answer = response.choices[0]?.message?.content || ''

    await ChatMessage.create({ userId, subjectId, role: 'user', content: question })
    const assistantMessage = await ChatMessage.create({ userId, subjectId, role: 'assistant', content: answer })

    return assistantMessage
  },

  async getHistory(userId: string, subjectId: string) {
    return ChatMessage.find({ userId, subjectId }).sort({ createdAt: 1 })
  },

  async clearHistory(userId: string, subjectId: string) {
    await ChatMessage.deleteMany({ userId, subjectId })
    return { message: 'chat.historyCleared' }
  }
}