import type { Request, Response } from 'express';
import createHttpError from 'http-errors';

import { AppDataSource } from '../../data-source';
import { ModuleProgress } from '../../entities/moduleProgress';
import { ChapterProgress } from '../../entities/chapterProgress';
import type {
  ModuleProgressCreateBody,
  ModuleProgressResponse,
  ChapterProgressCreateBody,
  ChapterProgressResponse,
} from '../../types/routes/userProgress';

// Helper function to get user ID
const getUserId = (req: Request): string => {
  if (!req.user || !req.user.id) {
    throw createHttpError(401, 'User not authenticated');
  }
  return req.user.id;
};

// Create or update module progress
const createOrUpdateModuleProgress = async (
  req: Request,
  res: Response<{ message: string }>
) => {
  const { moduleId, progressPercentage, completionStatus, completedAt } =
    req.body as ModuleProgressCreateBody;

  const userId = getUserId(req);

  const moduleProgressRepo = AppDataSource.getRepository(ModuleProgress);
  const existingProgress = await moduleProgressRepo.findOne({
    where: { module: { id: moduleId }, user: { id: userId } },
  });

  if (existingProgress) {
    // Update existing progress
    if (progressPercentage !== undefined)
      existingProgress.progressPercentage = progressPercentage;
    if (completionStatus !== undefined)
      existingProgress.completionStatus = completionStatus;
    if (completedAt !== undefined) existingProgress.completedAt = completedAt;

    await moduleProgressRepo.save(existingProgress);
    res.send({ message: 'Module progress updated successfully' });
  } else {
    // Create new progress
    const newProgress = moduleProgressRepo.create({
      module: { id: moduleId },
      user: { id: userId },
      progressPercentage: progressPercentage ?? 0,
      completionStatus: completionStatus ?? 'Not Started',
      completedAt: completedAt ?? null,
    });

    await moduleProgressRepo.save(newProgress);
    res.send({ message: 'Module progress created successfully' });
  }
};

const getModuleProgress = async (
  req: Request,
  res: Response<ModuleProgressResponse[]>
) => {
  const userId = getUserId(req);

  const progress = await AppDataSource.getRepository(ModuleProgress).find({
    where: { user: { id: userId } },
    relations: [
      'module',
      'module.chapters',
      'chapterProgress',
      'chapterProgress.chapter',
    ],
  });

  const response: ModuleProgressResponse[] = progress.map((mp) => {
    const chaptersProgress = mp.module.chapters.map((chapter) => {
      const progress = mp.chapterProgress.find(
        (cp) => cp.chapter.id === chapter.id
      );
      return {
        id: progress?.id || `temp-${chapter.id}`,
        chapterId: chapter.id,
        moduleProgressId: mp.id,
        progressPercentage: progress?.progressPercentage || 0,
        completionStatus: progress?.completionStatus || 'Not Started',
        completedAt: progress?.completedAt || null,
        createdAt: progress?.createdAt || new Date(),
        updatedAt: progress?.updatedAt || new Date(),
      };
    });

    return {
      id: mp.id,
      moduleId: mp.module.id,
      progressPercentage: mp.progressPercentage,
      completionStatus: mp.completionStatus,
      completedAt: mp.completedAt,
      createdAt: mp.createdAt,
      updatedAt: mp.updatedAt,
      chaptersProgress,
    };
  });

  res.send(response);
};

// Create or update chapter progress
const createOrUpdateChapterProgress = async (
  req: Request,
  res: Response<{ message: string }>
) => {
  const {
    moduleProgressId,
    chapterId,
    progressPercentage,
    completionStatus,
    completedAt,
  } = req.body as ChapterProgressCreateBody;

  const chapterProgressRepo = AppDataSource.getRepository(ChapterProgress);
  const existingProgress = await chapterProgressRepo.findOne({
    where: {
      moduleProgress: { id: moduleProgressId },
      chapter: { id: chapterId },
    },
  });

  if (existingProgress) {
    // Update existing progress
    if (progressPercentage !== undefined)
      existingProgress.progressPercentage = progressPercentage;
    if (completionStatus !== undefined)
      existingProgress.completionStatus = completionStatus;
    if (completedAt !== undefined) existingProgress.completedAt = completedAt;

    await chapterProgressRepo.save(existingProgress);
    res.send({ message: 'Chapter progress updated successfully' });
  } else {
    // Create new progress
    const newProgress = chapterProgressRepo.create({
      moduleProgress: { id: moduleProgressId },
      chapter: { id: chapterId },
      progressPercentage: progressPercentage ?? 0,
      completionStatus: completionStatus ?? 'Not Started',
      completedAt: completedAt ?? null,
    });

    await chapterProgressRepo.save(newProgress);
    res.send({ message: 'Chapter progress created successfully' });
  }
};

// Get chapter progress for a module
const getChapterProgress = async (
  req: Request,
  res: Response<ChapterProgressResponse[]>
) => {
  const { moduleProgressId } = req.params;
  const chapterProgressRepo = AppDataSource.getRepository(ChapterProgress);

  const progress = await chapterProgressRepo.find({
    where: { moduleProgress: { id: moduleProgressId } },
    relations: ['chapter', 'moduleProgress'],
  });

  const response: ChapterProgressResponse[] = progress.map((cp) => ({
    id: cp.id,
    chapterId: cp.chapter.id,
    moduleProgressId: cp.moduleProgress.id,
    progressPercentage: cp.progressPercentage,
    completionStatus: cp.completionStatus,
    completedAt: cp.completedAt,
    createdAt: cp.createdAt,
    updatedAt: cp.updatedAt,
  }));

  res.send(response);
};

export default {
  createOrUpdateModuleProgress,
  getModuleProgress,
  createOrUpdateChapterProgress,
  getChapterProgress,
};
