import type { Request, Response } from 'express';

import type { UsersGetResponse } from 'src/types/routes/users';

import { In } from 'typeorm';

import { UserType } from '../../enums/enum';

import { AppDataSource } from '../../data-source';
import { User } from '../../entities/user';
import { Progress } from '../../entities/progress';
import { Section } from '../../entities/section';
import { Comment } from '../../entities/comment';
import { Mood } from '../../entities/mood';
import { Answer } from '../../entities/answer';
import type {
  ChapterData,
  ModuleData,
  NestedComment,
} from '../../types/commonTypes';

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
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
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
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
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
  const sectionRepo = AppDataSource.getRepository(Section);
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

    const sectionIds = userProgress.map((progress) => progress.sectionId);
    const sections = await sectionRepo.findByIds(sectionIds);

    const comments = await commentRepo
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.replies', 'replies')
      .leftJoinAndSelect('comment.parent', 'parent')
      .leftJoinAndSelect('comment.section', 'section') // Include section relation
      .leftJoinAndSelect('comment.sectionUser', 'sectionUser')
      .leftJoinAndSelect('comment.commentUser', 'commentUser')
      .where('comment.sectionId IN (:...sectionIds)', { sectionIds })
      .andWhere('comment.sectionUser.id = :userId', { userId: parsedUserId })
      .getMany();

    const answers = await answerRepo.find({
      where: { sectionId: In(sectionIds), userId: parsedUserId }, // Fetch answers for the user and sections
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
          sectionUserId: comment.sectionUser.id,
          sectionUsername: comment.sectionUser.username,
          commentUserId: comment.commentUser.id,
          commentUsername: comment.commentUser.username,
          text: comment.text,
          createdAt: comment.createdAt.toISOString(),
          replies: buildNestedComments(comment.id, allComments),
        }));

    const modules: Record<string, { chapters: Record<string, ChapterData> }> =
      {};

    userProgress.forEach((progress) => {
      const section = sections.find((s) => s.id === progress.sectionId);
      if (!section) {
        console.warn(`Section with ID ${progress.sectionId} not found.`);
        return;
      }

      const [moduleId, chapterId] = section.folderUrl.split('/').slice(0, 2);

      if (!modules[moduleId]) {
        modules[moduleId] = {
          chapters: {},
        };
      }

      if (!modules[moduleId].chapters[chapterId]) {
        modules[moduleId].chapters[chapterId] = {
          chapterId,
          sections: [],
        };
      }

      const sectionComments = comments.filter(
        (comment) => comment.section.id === section.id
      );

      type AnswerValue = string | { question: string; answer: string };

      const parseAnswers = (rawAnswers: Record<string, AnswerValue>): Record<string, { question: string; answer: string }> => {
        const parsedAnswers: Record<string, { question: string; answer: string }> = {};
      
        Object.entries(rawAnswers).forEach(([key, value]) => {
          if (typeof value === 'string') {
            parsedAnswers[key] = {
              question: `Default question for ${key}`,
              answer: value,
            };
          } else if (typeof value === 'object' && value !== null && 'question' in value && 'answer' in value) {
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

      const sectionAnswers = answers
      .filter(answer => answer.sectionId === section.id)
      .reduce((acc, answer) => {
        if (
          typeof answer.text === 'object' &&
          answer.text !== null &&
          !Array.isArray(answer.text)
        ) {
          const parsed = parseAnswers(answer.text as Record<string, AnswerValue>); // Cast after check
          Object.assign(acc, parsed); // Merge parsed data into the accumulator
        } else {
          console.warn('Invalid answer.text format:', answer.text);
        }
        return acc;
      }, {} as Record<string, { question: string; answer: string }>);
    
      modules[moduleId].chapters[chapterId].sections.push({
        sectionId: section.id,
        name: section.title,
        createdAt: progress.createdAt.toISOString(),
        updatedAt: progress.updatedAt.toISOString(),
        progressPercentage: progress.value,
        comments: buildNestedComments(null, sectionComments),
        answers: sectionAnswers, // Include answers here
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

// Change user to to admin and vice versa
const changeUserRole = async (req: Request, res: Response) => {
  const userRepo = AppDataSource.getRepository(User);
  const { id } = req.params;

  const userId = parseInt(id, 10);
  if (isNaN(userId) || userId < 1) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const user = await userRepo.findOneBy({ id: userId });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === UserType.ADMIN) {
      user.role = UserType.CLIENT;
    } else {
      user.role = UserType.ADMIN;
    }

    await userRepo.save(user);

    res.status(200).json({ message: 'User role changed successfully' });
  } catch (err) {
    console.error('Error changing user role:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default {
  getAllUsers,
  getUsersById,
  getUserProgress,
  getUserMoodById,
  changeUserRole,
};
