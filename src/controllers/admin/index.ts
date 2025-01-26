import type { Request, Response } from 'express';

import type { UsersGetResponse } from 'src/types/users';

import { In } from 'typeorm';

import createHttpError from 'http-errors';

import { AppDataSource } from '../../data-source';
import { User } from '../../entities/user';
import { Progress } from '../../entities/progress';
import { Chapter } from '../../entities/chapter';
import { Comment } from '../../entities/comment';
import { Mood } from '../../entities/mood';
import { Answer } from '../../entities/answer';
import type { ModuleData, NestedComment } from '../../types/commonTypes';
import logger from '../../logger';

// Get all users
const getAllUsers = (req: Request, res: Response) => {
  const userRepo = AppDataSource.getRepository(User);

  // Get all users with role 'user', isActive = true, and isVerified = true
  userRepo
    .find({
      where: { isActive: true },
    })
    .then((users) => {
      // Map the database entities to the UsersGetResponse interface
      const userResponses: UsersGetResponse[] = users.map((user) => ({
        id: user.id,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isActive: user.isActive,
      }));

      res.status(200).json(userResponses);
    })
    .catch((err) => {
      console.error('Database error:', err); // Log the error for debugging
      res.status(500).json({ message: 'Internal server error' });
    });
};

// Get admin by ID
const getUsersById = (req: Request, res: Response) => {
  const userRepo = AppDataSource.getRepository(User);
  const { id } = req.params;

  const userId = parseInt(id, 10);
  if (isNaN(userId) || userId < 1) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  userRepo
    .findOneBy({ id: userId })
    .then((user) => {
      if (user) {
        // Map the database entity to the UsersGetResponse interface
        const userResponse: UsersGetResponse = {
          id: user.id,
          username: user.username,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          isActive: user.isActive,
        };

        res.status(200).json(userResponse);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    })
    .catch((err) => {
      console.error('Database error:', err);
      res.status(500).json({ message: 'Internal server error' });
    });
};

const getUserProgress = async (req: Request, res: Response): Promise<void> => {
  const userProgressRepo = AppDataSource.getRepository(Progress);
  const chapterRepo = AppDataSource.getRepository(Chapter);
  const commentRepo = AppDataSource.getRepository(Comment);
  const answerRepo = AppDataSource.getRepository(Answer); // Repository for the answer table

  const { userId } = req.params;
  const parsedUserId = parseInt(userId, 10);

  if (isNaN(parsedUserId) || parsedUserId < 1) {
    res.status(400).json({ message: 'Invalid user ID' });
    return;
  }

  try {
    const userProgress = await userProgressRepo.find({
      where: { userId: parsedUserId },
    });

    if (userProgress.length === 0) {
      res.status(404).json({ message: 'User progress not found' });
      return;
    }

    const chapterIds = userProgress.map((progress) => progress.chapterId);
    const chapters = await chapterRepo.find({
      where: { id: In(chapterIds) },
      relations: ['module'], // Explicitly load the `module` relation
    });

    const comments = await commentRepo
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.replies', 'replies')
      .leftJoinAndSelect('comment.parent', 'parent')
      .leftJoinAndSelect('comment.chapter', 'chapter') // Include chapter relation
      .leftJoinAndSelect('comment.chapterUser', 'chapterUser')
      .leftJoinAndSelect('comment.commentUser', 'commentUser')
      .where('comment.chapterId IN (:...chapterIds)', {
        chapterIds: chapterIds,
      })
      .andWhere('comment.chapterUser.id = :userId', { userId: parsedUserId })
      .getMany();

    const answers = await answerRepo.find({
      where: { chapterId: In(chapterIds), userId: parsedUserId }, // Fetch answers for the user and chapters
    });

    const buildNestedComments = (
      parentId: number | null,
      allComments: Comment[]
    ): NestedComment[] =>
      allComments
        .filter((comment) => (comment.parent?.id || null) === parentId)
        .map((comment) => ({
          parentId: comment.parent?.id || null,
          commentId: comment.id,
          chapterUserId: comment.chapterUser.id,
          chapterUsername: comment.chapterUser.username,
          commentUserId: comment.commentUser.id,
          commentUsername: comment.commentUser.username,
          text: comment.text,
          createdAt: comment.createdAt.toISOString(),
          replies: buildNestedComments(comment.id, allComments),
        }));

    const modules: Record<string, ModuleData> = {};

    userProgress.forEach((progress) => {
      const chapter = chapters.find((s) => s.id === progress.chapterId);
      if (!chapter) {
        console.warn(`Chapter with ID ${progress.chapterId} not found.`);
        return;
      }

      const moduleId = chapter.module.id;

      const chapterComments = comments.filter(
        (comment) => comment.chapter.id === chapter.id
      );

      type AnswerValue = string | { question: string; answer: string };

      const parseAnswers = (
        rawAnswers: Record<string, AnswerValue>
      ): Record<string, { question: string; answer: string }> => {
        const parsedAnswers: Record<
          string,
          { question: string; answer: string }
        > = {};

        Object.entries(rawAnswers).forEach(([key, value]) => {
          if (typeof value === 'string') {
            parsedAnswers[key] = {
              question: `Default question for ${key}`,
              answer: value,
            };
          } else if (
            typeof value === 'object' &&
            value !== null &&
            'question' in value &&
            'answer' in value
          ) {
            parsedAnswers[key] = {
              question: value.question,
              answer: value.answer,
            };
          } else {
            console.warn(`Unexpected format for key: ${key}, value:`, value);
          }
        });

        return parsedAnswers;
      };

      const chapterAnswers = answers
        .filter((answer) => answer.chapterId === chapter.id)
        .reduce((acc, answer) => {
          if (
            typeof answer.text === 'object' &&
            answer.text !== null &&
            !Array.isArray(answer.text)
          ) {
            const parsed = parseAnswers(
              answer.text as Record<string, AnswerValue>
            ); // Cast after check
            Object.assign(acc, parsed); // Merge parsed data into the accumulator
          } else {
            console.warn('Invalid answer.text format:', answer.text);
          }
          return acc;
        }, {} as Record<string, { question: string; answer: string }>);

      if (!modules[moduleId]) {
        modules[moduleId] = { moduleId: moduleId.toString(), chapters: [] };
      }

      modules[moduleId].chapters.push({
        chapterId: chapter.id,
        name: chapter.title,
        createdAt: progress.createdAt.toISOString(),
        updatedAt: progress.updatedAt.toISOString(),
        progressPercentage: progress.value,
        comments: buildNestedComments(null, chapterComments),
        answers: chapterAnswers, // Include answers here
      });
    });

    const formattedModules: ModuleData[] = Object.entries(modules).map(
      ([moduleId, moduleData]) => ({
        moduleId,
        chapters: Object.values(moduleData.chapters),
      })
    );

    res.status(200).json(formattedModules);
  } catch (err) {
    console.error('Error fetching user progress:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user mood by user ID
const getUserMoodById = async (req: Request, res: Response) => {
  const moodRepo = AppDataSource.getRepository(Mood);
  const { userId } = req.params;

  const parsedUserId = parseInt(userId, 10);
  if (isNaN(parsedUserId) || parsedUserId < 1) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const moods = await moodRepo.find({
      where: { userId: parsedUserId },
      order: { createdAt: 'ASC' },
    });

    const moodData: string[] = moods.map(
      (data) => `${data.createdAt}|${data.feeling}|${data.motivation}`
    );

    res.status(200).json(moodData);
  } catch (err) {
    console.error('Error fetching user mood:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const resetUserPassword = async (
  req: TypedRequestBody<{ userId: number; newPassword: string }>,
  res: Response
) => {
  // Extract userId and newPassword from the request body
  const { userId, newPassword } = req.body;

  if (!userId || !newPassword) {
    throw createHttpError(400, 'User ID and new password are required!');
  }

  // Create a query runner
  const queryRunner = AppDataSource.createQueryRunner();

  try {
    // Connect and start transaction
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const userRepo = queryRunner.manager.getRepository(User);

    // Fetch the user by ID
    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    // Set the new password
    user.setPassword(newPassword); // Assumes `setPassword` hashes the password internally
    user.updatedAt = new Date();

    // Save the updated user
    await queryRunner.manager.save(user);

    // Commit the transaction
    await queryRunner.commitTransaction();

    return res.status(200).json({ message: 'Password reset successfully!' });
  } catch (err) {
    // Rollback the transaction on error
    if (queryRunner.isTransactionActive) {
      await queryRunner.rollbackTransaction();
    }

    // Log and handle the error
    logger.error('Error resetting user password:', err);

    // Handle known error types
    if (err instanceof createHttpError.HttpError) {
      throw err;
    } else {
      throw createHttpError(500, 'Internal Server Error!');
    }
  } finally {
    // Release the query runner
    await queryRunner.release();
  }
};

export default {
  getAllUsers,
  getUsersById,
  getUserProgress,
  getUserMoodById,
  resetUserPassword,
};
