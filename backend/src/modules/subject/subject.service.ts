import { Subject } from './subject.model'
import type { CreateSubjectInput, ChapterInput } from './subject.schema'

export const subjectService = {

  async getAll(userId: string) {
    return Subject.find({ userId }).sort({ examDate: 1 })
  },

  async getOne(userId: string, subjectId: string) {
    const subject = await Subject.findOne({ _id: subjectId, userId })
    if (!subject) throw new Error('Module introuvable')
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
    if (!subject) throw new Error('Module introuvable')
    return subject
  },

  async delete(userId: string, subjectId: string) {
    const subject = await Subject.findOneAndDelete({ _id: subjectId, userId })
    if (!subject) throw new Error('Module introuvable')
    return { message: 'Module supprimé' }
  },

  async addChapter(userId: string, subjectId: string, data: ChapterInput) {
    const subject = await Subject.findOne({ _id: subjectId, userId })
    if (!subject) throw new Error('Module introuvable')
    subject.chapters.push({ ...data, covered: false })
    await subject.save()
    return subject
  },

  async updateChapter(userId: string, subjectId: string, chapterId: string, data: Partial<ChapterInput>) {
    const subject = await Subject.findOne({ _id: subjectId, userId })
    if (!subject) throw new Error('Module introuvable')
    const chapter = subject.chapters.find(c => c._id?.toString() === chapterId)
    if (!chapter) throw new Error('Chapitre introuvable')
    Object.assign(chapter, data)
    await subject.save()
    return subject
  },

  async deleteChapter(userId: string, subjectId: string, chapterId: string) {
    const subject = await Subject.findOne({ _id: subjectId, userId })
    if (!subject) throw new Error('Module introuvable')
    subject.chapters = subject.chapters.filter(c => c._id?.toString() !== chapterId)
    await subject.save()
    return subject
  }
}
