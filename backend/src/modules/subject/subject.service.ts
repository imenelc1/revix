import { Subject } from './subject.model'
import { CourseDocument } from '../document/document.model'
import { Flashcard, Quiz } from '../flashcard/flashcard.model'
import { ChatMessage } from '../chat/chat.model'
import { Planning } from '../planning/planning.model'
import type { CreateSubjectInput, ChapterInput } from './subject.schema'

export const subjectService = {

  async getAll(userId: string) {
    return Subject.find({ userId }).sort({ examDate: 1 })
  },

  async getOne(userId: string, subjectId: string) {
    const subject = await Subject.findOne({ _id: subjectId, userId })
    if (!subject) throw new Error('subject.notFound')
    return subject
  },

  async create(userId: string, data: CreateSubjectInput) {
    const subject = await Subject.create({
      userId,
      name: data.name,
      color: data.color || '#6366f1',
      examDate: new Date(data.examDate)
    })
    return subject
  },

  async update(userId: string, subjectId: string, data: Partial<CreateSubjectInput>) {
    const subject = await Subject.findOneAndUpdate(
      { _id: subjectId, userId },
      { ...data, ...(data.examDate && { examDate: new Date(data.examDate) }) },
      { new: true }
    )
    if (!subject) throw new Error('subject.notFound')
    return subject
  },

  // ── Suppression d'un module + nettoyage en cascade de toutes les données liées ──
  async delete(userId: string, subjectId: string) {
    const subject = await Subject.findOneAndDelete({ _id: subjectId, userId })
    if (!subject) throw new Error('subject.notFound')

    await Promise.all([
      CourseDocument.deleteMany({ userId, subjectId }),
      Flashcard.deleteMany({ userId, subjectId }),
      Quiz.deleteMany({ userId, subjectId }),
      ChatMessage.deleteMany({ userId, subjectId }),
      Planning.updateOne({ userId }, { $pull: { sessions: { subjectId } } })
    ])

    // Recalcule le score de préparation du planning restant — le module supprimé
    // ne doit plus compter dans le total des chapitres.
    const planning = await Planning.findOne({ userId })
    if (planning) {
      const remainingSubjects = await Subject.find({ userId })
      const totalChapters = remainingSubjects.reduce((sum, s) => sum + s.chapters.length, 0)
      if (totalChapters === 0) {
        await Planning.deleteOne({ userId })
      } else {
        const uniqueCovered = new Set(planning.sessions.map(s => s.chapterId.toString())).size
        planning.overallReadinessScore = Math.round((uniqueCovered / totalChapters) * 100)
        await planning.save()
      }
    }

    return { message: 'subject.deleted' }
  },

  async addChapter(userId: string, subjectId: string, data: ChapterInput) {
    const subject = await Subject.findOne({ _id: subjectId, userId })
    if (!subject) throw new Error('subject.notFound')
    subject.chapters.push({ ...data, covered: false })
    await subject.save()
    return subject
  },

  async updateChapter(userId: string, subjectId: string, chapterId: string, data: Partial<ChapterInput>) {
    const subject = await Subject.findOne({ _id: subjectId, userId })
    if (!subject) throw new Error('subject.notFound')
    const chapter = subject.chapters.find(c => c._id?.toString() === chapterId)
    if (!chapter) throw new Error('chapter.notFound')
    Object.assign(chapter, data)
    await subject.save()
    return subject
  },

  async deleteChapter(userId: string, subjectId: string, chapterId: string) {
    const subject = await Subject.findOne({ _id: subjectId, userId })
    if (!subject) throw new Error('subject.notFound')
    subject.chapters = subject.chapters.filter(c => c._id?.toString() !== chapterId)
    await subject.save()
    return subject
  }
}