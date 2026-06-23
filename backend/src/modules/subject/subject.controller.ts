import { Response } from 'express'
import { subjectService } from './subject.service'
import { CreateSubjectSchema, UpdateSubjectSchema, ChapterSchema, UpdateChapterSchema } from './subject.schema'
import type { AuthRequest } from '../../middlewares/auth.middleware'
import { t, translateZodErrors } from '../../utils/i18n'
export const subjectController = {

  async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const subjects = await subjectService.getAll(req.userId!)
      res.json(subjects)
    } catch (error: any) {
      res.status(500).json({ error: t(error.message, req.locale) })
    }
  },

  async getOne(req: AuthRequest, res: Response): Promise<void> {
    try {
      const subject = await subjectService.getOne(req.userId!, String(req.params.id))
      res.json(subject)
    } catch (error: any) {
      res.status(404).json({ error: t(error.message, req.locale) })
    }
  },

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = CreateSubjectSchema.parse(req.body)
      const subject = await subjectService.create(req.userId!, data)
      res.status(201).json(subject)
    } catch (error: any) {
      if (error.name === 'ZodError') { res.status(400).json({ error: error.errors }); return }
      res.status(400).json({ error: t(error.message, req.locale) })
    }
  },

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = UpdateSubjectSchema.parse(req.body)
      const subject = await subjectService.update(req.userId!, String(req.params.id), data)
      res.json(subject)
    } catch (error: any) {
      if (error.name === 'ZodError') { res.status(400).json({ error: error.errors }); return }
      res.status(400).json({ error: t(error.message, req.locale) })
    }
  },

  async delete(req: AuthRequest, res: Response): Promise<void> {
  try {
    const result = await subjectService.delete(req.userId!, String(req.params.id))
    res.json({ message: t(result.message, req.locale) })
  } catch (error: any) {
    res.status(404).json({ error: t(error.message, req.locale) })
  }
},

  async addChapter(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = ChapterSchema.parse(req.body)
      const subject = await subjectService.addChapter(req.userId!, String(req.params.id), data)
      res.status(201).json(subject)
    } catch (error: any) {
      if (error.name === 'ZodError') { res.status(400).json({ error: error.errors }); return }
      res.status(400).json({ error: t(error.message, req.locale) })
    }
  },

  async updateChapter(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = UpdateChapterSchema.parse(req.body)
      const subject = await subjectService.updateChapter(req.userId!, String(req.params.id), String(req.params.chapterId), data)
      res.json(subject)
    } catch (error: any) {
      if (error.name === 'ZodError') { res.status(400).json({ error: error.errors }); return }
      res.status(400).json({ error: t(error.message, req.locale) })
    }
  },

  async deleteChapter(req: AuthRequest, res: Response): Promise<void> {
    try {
      const subject = await subjectService.deleteChapter(req.userId!, String(req.params.id), String(req.params.chapterId))
      res.json(subject)
    } catch (error: any) {
      res.status(404).json({ error: t(error.message, req.locale) })
    }
  }
}
