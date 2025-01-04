import type { Request, Response } from 'express';
import createHttpError from 'http-errors';

import { AppDataSource } from '../../data-source';
import { ModuleProgress } from '../../entities/moduleProgress';
import { ChapterProgress } from '../../entities/chapterProgress';
import { FileProgress } from '../../entities/fileProgress';

import type {
  ModuleProgressCreateBody,
  ModuleProgressResponse,
  ChapterProgressCreateBody,
  ChapterProgressResponse,
  FileProgressResponse,
  FileProgressCreateBody
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
  const { moduleId, completionStatus, completedAt } =
    req.body as ModuleProgressCreateBody;

  const userId = getUserId(req);

  const moduleProgressRepo = AppDataSource.getRepository(ModuleProgress);
  const existingProgress = await moduleProgressRepo.findOne({
    where: { module: { id: moduleId }, user: { id: userId } },
    relations: ['chapterProgress', 'chapterProgress.fileProgress'],
  });

  if (existingProgress) {
    // Update existing progress
    if (completionStatus !== undefined)
      existingProgress.completionStatus = completionStatus;
    if (completedAt !== undefined) existingProgress.completedAt = completedAt;

    // Recalculate progress percentage based on chapterProgress
    existingProgress.calculateProgress();

    await moduleProgressRepo.save(existingProgress);
    res.send({ message: 'Module progress updated successfully' });
  } else {
    // Create new progress
    const newProgress = moduleProgressRepo.create({
      module: { id: moduleId },
      user: { id: userId },
      progressPercentage: 0,
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
      'chapterProgress.fileProgress',
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
    completionStatus,
    completedAt,
  } = req.body as ChapterProgressCreateBody;

  const chapterProgressRepo = AppDataSource.getRepository(ChapterProgress);
  const existingProgress = await chapterProgressRepo.findOne({
    where: {
      moduleProgress: { id: moduleProgressId },
      chapter: { id: chapterId },
    },
    relations: ['fileProgress'],
  });

  if (existingProgress) {
    // Update existing progress
    if (completionStatus !== undefined)
      existingProgress.completionStatus = completionStatus;
    if (completedAt !== undefined) existingProgress.completedAt = completedAt;

    // Recalculate progress percentage based on fileProgress
    existingProgress.calculateProgress();

    await chapterProgressRepo.save(existingProgress);
    res.send({ message: 'Chapter progress updated successfully' });
  } else {
    // Create new progress
    const newProgress = chapterProgressRepo.create({
      moduleProgress: { id: moduleProgressId },
      chapter: { id: chapterId },
      progressPercentage: 0,
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
    relations: ['chapter', 'fileProgress', 'moduleProgress'],
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

const createOrUpdateFileProgress = async (
  req: Request,
  res: Response<{ message: string }>
) => {
  const { chapterProgressId, fileId, isCompleted, completedAt } =
    req.body as FileProgressCreateBody;

  const fileProgressRepo = AppDataSource.getRepository(FileProgress);

  // Find existing progress for the file
  const existingProgress = await fileProgressRepo.findOne({
    where: {
      chapterProgress: { id: chapterProgressId },
      file: { id: fileId },
    },
  });

  if (existingProgress) {
    // Update existing file progress
    if (isCompleted !== undefined) existingProgress.isCompleted = isCompleted;
    if (completedAt !== undefined) existingProgress.completedAt = completedAt;

    await fileProgressRepo.save(existingProgress);

    // Update chapter progress
    const chapterProgress = existingProgress.chapterProgress;
    chapterProgress.calculateProgress();
    await AppDataSource.getRepository(ChapterProgress).save(chapterProgress);

    res.send({ message: 'File progress updated successfully' });
  } else {
    // Create new file progress
    const newProgress = fileProgressRepo.create({
      chapterProgress: { id: chapterProgressId },
      file: { id: fileId },
      isCompleted: isCompleted ?? false,
      completedAt: completedAt ?? null,
    });

    await fileProgressRepo.save(newProgress);

    // Update chapter progress
    const chapterProgress = await AppDataSource.getRepository(ChapterProgress).findOne({
      where: { id: chapterProgressId },
      relations: ['fileProgress'],
    });

    if (chapterProgress) {
      chapterProgress.calculateProgress();
      await AppDataSource.getRepository(ChapterProgress).save(chapterProgress);
    }

    res.send({ message: 'File progress created successfully' });
  }
};

const getFileProgress = async (
  req: Request,
  res: Response<FileProgressResponse[]>
) => {
  const { chapterProgressId } = req.params;

  const fileProgressRepo = AppDataSource.getRepository(FileProgress);

  // Retrieve file progress entries for the given chapter progress
  const progress = await fileProgressRepo.find({
    where: { chapterProgress: { id: chapterProgressId } },
    relations: ['file', 'chapterProgress'],
  });

  const response: FileProgressResponse[] = progress.map((fp) => ({
    id: fp.id,
    chapterProgressId: fp.chapterProgress.id,
    fileId: fp.file.id,
    isCompleted: fp.isCompleted,
    completedAt: fp.completedAt,
    createdAt: fp.createdAt,
    updatedAt: fp.updatedAt,
  }));

  res.send(response);
};

export default {
  createOrUpdateModuleProgress,
  getModuleProgress,
  createOrUpdateChapterProgress,
  getChapterProgress,
  getFileProgress,
  createOrUpdateFileProgress
};
