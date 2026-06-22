import { CourseDocument } from './document.model'

export const documentService = {
  async create(userId: string, subjectId: string, fileName: string, chaptersGenerated: number) {
    return CourseDocument.create({ userId, subjectId, fileName, chaptersGenerated })
  },

  async getBySubject(userId: string, subjectId: string) {
    return CourseDocument.find({ userId, subjectId }).sort({ uploadedAt: -1 })
  },

  async delete(userId: string, documentId: string) {
    const doc = await CourseDocument.findOneAndDelete({ _id: documentId, userId })
    if (!doc) throw new Error('Document introuvable')
    return { message: 'Document supprimé' }
  }
}
