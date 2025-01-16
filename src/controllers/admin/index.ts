import type { Request, Response } from 'express';

import type { UsersGetResponse } from 'src/types/routes/users';

import type { SectionComment, UserSection } from 'src/types/routes/progress';

import { UserType } from '../../enums/enum';

import { AppDataSource } from '../../data-source';
import { User } from '../../entities/user';
import { Progress } from '../../entities/progress';
import { Section } from '../../entities/section';
import { Comment } from '../../entities/comment';

// Get all users
const getAllUsers = (req: Request, res: Response) => {
  const userRepo = AppDataSource.getRepository(User);

  // Get all users with role 'user', isActive = true, and isVerified = true
  userRepo
    .find({
      where: { role: UserType.CLIENT, isActive: true, isVerified: true },
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

// Get user progress by user ID
const getUserProgress = async (req: Request, res: Response) => {
  const userProgressRepo = AppDataSource.getRepository(Progress);
  const sectionRepo = AppDataSource.getRepository(Section);
  const commentRepo = AppDataSource.getRepository(Comment);

  const { userId } = req.params;
  const parsedUserId = parseInt(userId, 10);

  if (isNaN(parsedUserId) || parsedUserId < 1) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const userProgress = await userProgressRepo.find({
      where: { userId: parsedUserId },
    });

    if (userProgress.length === 0) {
      return res.status(404).json({ message: 'User progress not found' });
    }

    const userSections: UserSection[] = await Promise.all(
      userProgress.map(async (progress) => {
        const section = await sectionRepo.findOne({
          where: { id: progress.sectionId },
        });

        if (!section) {
          throw new Error(`Section with ID ${progress.sectionId} not found`);
        }

        const comments = await commentRepo
          .createQueryBuilder('comment')
          .leftJoinAndSelect('comment.replies', 'replies')
          .leftJoinAndSelect('comment.parent', 'parent')
          .leftJoinAndSelect('comment.sectionUser', 'sectionUser')
          .leftJoinAndSelect('comment.commentUser', 'commentUser') // Fetch comment creator user
          .where('comment.sectionId = :sectionId', { sectionId: section.id })
          .andWhere('comment.sectionUser.id = :userId', {
            userId: parsedUserId,
          })
          .getMany();

        const buildNestedComments = (
          parentId: number | null,
          allComments: Comment[]
        ): SectionComment[] =>
          allComments
            .filter(
              (comment) =>
                (comment.parent ? comment.parent.id : null) === parentId
            )
            .map((comment) => ({
              parentId: comment.parent ? comment.parent.id : null,
              commentId: comment.id,
              sectionUserId: comment.sectionUser.id,
              sectionUsername: comment.sectionUser.username, // Add section user's username
              commentUserId: comment.commentUser.id,
              commentUsername: comment.commentUser.username, // Add comment creator's username
              text: comment.text,
              createdAt: comment.createdAt.toISOString(),
              replies: buildNestedComments(comment.id, allComments),
            }));

        const formattedComments = buildNestedComments(null, comments);

        return {
          userId: parsedUserId,
          sectionId: section.id,
          name: section.title,
          createdAt: progress.createdAt.toISOString(),
          updatedAt: progress.updatedAt.toISOString(),
          progressPercentage: progress.value,
          comments: formattedComments,
        };
      })
    );

    res.status(200).json(userSections);
  } catch (err) {
    console.error('Error fetching user progress:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default {
  getAllUsers,
  getUsersById,
  getUserProgress,
};
