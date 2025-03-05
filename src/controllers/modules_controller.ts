import type { Request, Response } from 'express';
import createHttpError from 'http-errors';

import { In } from 'typeorm';

import { AppDataSource } from '../data-source';
import { Module } from '../entities/module';

import type { ModuleResponse } from '../types/modules';
import { getUserId } from './users_controller';

import type { CreateProgressBody } from '../types/progress';
import { Progress } from '../entities/progress';
import logger from '../utils/logger';
import { Comment } from '../entities/comment';

export const getModuleIdList = async (
  _req: Request,
  res: Response
) => {
  const moduleRepo = AppDataSource.getRepository(Module);

  // Fetch all modules with chapters
  const modules = await moduleRepo.find({
    where: { isActive: true },
  });

  // Generate a list of strings
  const response: string[] = modules.map((data) => `${data.id}`);

  res.send(response);
};

export const getModuleById = async (
  req: Request,
  res: Response<ModuleResponse>
) => {
  const userId = getUserId(req);
  const { moduleId } = req.query;
  const moduleRepo = AppDataSource.getRepository(Module);
  const progressRepo = AppDataSource.getRepository(Progress);
  const commentRepo = AppDataSource.getRepository(Comment);

  if (!moduleId) {
    throw createHttpError(400, 'Module Id not defined!');
  }

  const moduleIdNumber = parseInt(moduleId as string, 10);
  if (isNaN(moduleIdNumber)) {
    throw createHttpError(400, 'Invalid Module ID.');
  }

  // Fetch all modules with chapters
  const module = await moduleRepo.findOne({
    where: { id: moduleIdNumber, isActive: true },
    relations: ['chapters'],
  });

  if (!module) {
    throw createHttpError(404, 'Module Not Found!');
  }

  // Extract chapter IDs from chapters
  const chapterIdList = module.chapters
    .map((chapter) => chapter.id); // Extract chapter IDs

  // Fetch progress for the user and the specified chapters
  const userProgress = await progressRepo.find({
    where: {
      userId,
      chapterId: In(chapterIdList), // Use the `In` operator to filter by chapter IDs
    },
  });

  // Create a progress map for quick lookup
  const progressMap = new Map(
    userProgress.map((progress) => [`${progress.chapterId}`, progress.value])
  );

  // Fetch comment counts grouped by chapterId
  const commentCounts = await commentRepo
    .createQueryBuilder('comment')
    .select('comment.chapterId', 'chapterId')
    .addSelect('COUNT(comment.id)', 'commentCount')
    .where('comment.chapterUserId = :userId', { userId })
    .andWhere('comment.chapterId IN (:...chapterIds)', { chapterIds: chapterIdList })
    .groupBy('comment.chapterId')
    .getRawMany();

  // Create a comment count map for quick lookup
  const commentCountMap = new Map(
    commentCounts.map((count) => [count.chapterId, parseInt(count.commentCount, 10)])
  );

  // Transform the response
  const response: ModuleResponse = {
    id: module.id,
    chapters: module.chapters.map((chapter) => ({
      id: chapter.id,
      index: chapter.index,
      updatedAt: chapter.updatedAt,
      title: chapter.title,
      folderUrl: chapter.folderUrl,
      isExercise: chapter.isExercise,
      progress: progressMap.get(`${chapter.id}`) || 0.0, // Default to 0 if no progress exists
      numOfComments: commentCountMap.get(chapter.id) || 0,
    })) };

  res.send(response);
};

export const createUpdateProgress = async (
  req: TypedRequestBody<CreateProgressBody>,
  res: Response
) => {
  const { chapterId, progress } = req.body;
  const userId = getUserId(req);

  // Input validation
  if (!chapterId) {
    throw createHttpError(400, 'Chapter id is required!');
  }

  // Input validation
  if (progress === undefined || progress < 0.0) {
    throw createHttpError(400, 'Progress not defined correctly!');
  }

  const progressRepo = AppDataSource.getRepository(Progress);
  
  try {
    // Check if a mood entry for today exists
    const existingProgress = await progressRepo.findOne({
      where: { userId, chapterId: chapterId },
    });

    if (existingProgress) {
      // Update existing progress
      existingProgress.value = progress;
      await progressRepo.save(existingProgress);
      return res.sendStatus(200); // Status 200 for updated entry
    }

    // Create a new mood entry
    const newMood = progressRepo.create({
      userId,
      chapterId: chapterId,
      value: progress
    });

    await progressRepo.save(newMood);
    return res.sendStatus(201); // Status 201 for new entry
  } catch (err) {
    logger.error('Error creating or updating chapter progress:', err);
    throw createHttpError(500, 'An error occurred while processing your request.');
  }
};

export const getDiaryDates = async (
  req: Request,
  res: Response<string[]>
) => {
  const userId = getUserId(req);

  try {
    const query = `
      SELECT DISTINCT TO_CHAR("createdAt", 'YYYY-MM-DD') AS date FROM "comment"
        WHERE "chapterUserId" = $1 AND "parentId" IS NULL
      UNION
      SELECT DISTINCT TO_CHAR("createdAt", 'YYYY-MM-DD') AS date FROM "answer"
        WHERE "userId" = $2
      ORDER BY date;
    `;

    const result = await AppDataSource.query(query, [userId, userId]);
    // result is an array of objects like [{ date: '2025-01-15' }, { date: '2025-01-16' }]
    const dates: string[] = result.map((row: { date: string }) => row.date);
    res.status(200).json(dates);
  } catch (error) {
    console.error('Error fetching dates:', error);
    res.status(500).json([]);
  }
};
