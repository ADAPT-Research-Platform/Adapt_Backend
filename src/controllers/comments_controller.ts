import type { Request, Response } from 'express';

import type { FindOperator } from 'typeorm';
import { Between, IsNull } from 'typeorm';

import createHttpError from 'http-errors';

import type {
  AddCommentBody,
  AddReplyBody,
  CommentResponse,
} from 'src/types/comments';

import { AppDataSource } from '../data-source';
import { Comment } from '../entities/comment';
import logger from '../utils/logger';
import { Chapter } from '../entities/chapter';
import { User } from '../entities/user';
import { UserType } from '../enums/enum';
import { getUserId } from './users_controller';

export const createComment = async (
  req: TypedRequestBody<AddCommentBody>,
  res: Response<CommentResponse>
) => {
  const { text, chapterId, chapterUserId } = req.body;
  const userId = getUserId(req);

  if (!text) {
    throw createHttpError(400, 'Comment text not specified!');
  }

  if (!chapterId) {
    throw createHttpError(400, 'Chapter Id not specified!');
  }

  try {
    const chapterRepo = AppDataSource.getRepository(Chapter);
    const userRepo = AppDataSource.getRepository(User);
    const commentRepo = AppDataSource.getRepository(Comment);

    const commentUser = await userRepo.findOne({ where: { id: userId } });
    if (!commentUser) {
      throw createHttpError(404, 'User not found!');
    }

    let chapterUser;
    if (commentUser.role === UserType.ADMIN) {
      // Admin always need to specify chapter User
      if (!chapterUserId) {
        throw createHttpError(404, 'ChapterUserId Not specified by ADMIN!');
      }

      if (chapterUserId !== userId) {
        chapterUser = await userRepo.findOne({ where: { id: chapterUserId } });
        // Sends a notification to chapterUser
        logger.info(`Send a comment notification to user: ${chapterUserId} on chapter: ${chapterId}`);
      }
    } else {
      chapterUser = commentUser;
    }

    if (!chapterUser) {
      throw createHttpError(404, 'Chapter User not found!');
    }

    const chapter = await chapterRepo.findOne({ where: { id: chapterId } });

    if (!chapter) {
      throw createHttpError(404, 'Comment Chapter not found.');
    }

    const comment = new Comment();
    comment.text = text;
    comment.chapter = chapter;
    comment.chapterUser = chapterUser;
    comment.commentUser = commentUser;

    await commentRepo.save(comment);

    return res.sendStatus(201);
  } catch (err) {
    console.error('Error creating comment:', err);

    // Handle errors gracefully
    if (err instanceof createHttpError.HttpError) {
      throw err;
    } else {
      throw createHttpError(500, 'Internal Server Error');
    }
  }
};

export const createReply = async (
  req: TypedRequestBody<AddReplyBody>,
  res: Response<CommentResponse>
) => {
  const { text, parentCommentId } = req.body;
  const userId = getUserId(req);

  // Validate input
  if (!text) {
    throw createHttpError(400, 'Reply text not specified!');
  }

  if (!parentCommentId) {
    throw createHttpError(400, 'Parent Comment ID not specified!');
  }

  try {
    const userRepo = AppDataSource.getRepository(User);
    const commentRepo = AppDataSource.getRepository(Comment);

    // Fetch the user and parent comment
    const commentUser = await userRepo.findOne({ where: { id: userId } });
    if (!commentUser) {
      throw createHttpError(404, 'User not found!');
    }

    const parentComment = await commentRepo.findOne({
      where: { id: parentCommentId },
      relations: ['chapter', 'chapterUser'],
    });

    if (!parentComment) {
      throw createHttpError(404, 'Parent comment not found!');
    }

    // Create the reply
    const comment = new Comment();
    comment.text = text;
    comment.parent = parentComment;
    comment.chapter = parentComment.chapter;
    comment.chapterUser = parentComment.chapterUser;
    comment.commentUser = commentUser;

    // Save the reply
    await commentRepo.save(comment);

    return res.sendStatus(201); // Created status with no response body
  } catch (err) {
    console.error('Error creating reply:', err);

    // Handle errors gracefully
    if (err instanceof createHttpError.HttpError) {
      throw err;
    } else {
      throw createHttpError(500, 'Internal Server Error');
    }
  }
};

export const getComments = async (
  req: Request,
  res: Response<CommentResponse[]>
) => {
  const userId = getUserId(req);
  const { chapterId, date } = req.query;

  if (!chapterId && !date) {
    throw createHttpError(400, 'Either Chapter ID or Date must be provided.');
  }

  // Initialize the filter object
  const filter: {
    chapter?: { id: number };
    createdAt?: FindOperator<Date>; // Use FindOperator to allow `Between()`
    chapterUser: { id: number };
    parent: FindOperator<null>;
  } = { chapterUser: { id: userId }, parent: IsNull() };

  // Add chapterId filter if provided
  if (chapterId) {
    const chapterIdNumber = parseInt(chapterId as string, 10);
    if (isNaN(chapterIdNumber)) {
      throw createHttpError(400, 'Invalid Chapter ID.');
    }
    filter.chapter = { id: chapterIdNumber };
  }

  // Add date filter if provided (comparing only the date part)
  if (date) {
    const parsedDate = new Date(date as string);
    if (isNaN(parsedDate.getTime())) {
      throw createHttpError(400, 'Invalid Date.');
    }

    const { currentDate, nextDate } = getStartAndEndOfDate(parsedDate);

    logger.info(`${parsedDate} ${currentDate} ${nextDate}`);
    filter.createdAt = Between(currentDate, nextDate);
  }

  try {
    const commentRepo = AppDataSource.getRepository(Comment);

    // Fetch root comments (comments without a parent)
    logger.info(filter.createdAt);
    const rootComments = await commentRepo.find({
      where: filter,
      relations: ['commentUser', 'chapter'],
      order: { createdAt: 'ASC' }, // Optional: Order by creation time
    });

    // Recursive function to fetch replies
    const fetchReplies = async (
      parentId: number
    ): Promise<CommentResponse[]> => {
      const replies = await commentRepo.find({
        where: { parent: { id: parentId } },
        relations: ['commentUser', 'chapter'],
        order: { createdAt: 'ASC' }, // Optional: Order by creation time
      });

      return Promise.all(
        replies.map(async (reply) => ({
          id: reply.id,
          moduleId: reply.chapter.moduleId,
          chapterIndex: reply.chapter.index,
          text: reply.text,
          createdAt: reply.createdAt,
          commentUserName: reply.commentUser.username,
          replies: await fetchReplies(reply.id), // Recursive call
        }))
      );
    };

    // Map root comments and fetch their replies recursively
    const mappedComments: CommentResponse[] = await Promise.all(
      rootComments.map(async (comment) => ({
        id: comment.id,
        moduleId: comment.chapter.moduleId,
        chapterIndex: comment.chapter.index,
        text: comment.text,
        createdAt: comment.createdAt,
        commentUserName: comment.commentUser.username,
        replies: await fetchReplies(comment.id),
      }))
    );

    res.status(200).json(mappedComments);
  } catch (err) {
    console.error('Error getting comment:', err);

    // Handle errors gracefully
    if (err instanceof createHttpError.HttpError) {
      throw err;
    } else {
      throw createHttpError(500, 'Internal Server Error');
    }
  }
};

export const getStartAndEndOfDate = (
  date: Date
): { currentDate: Date; nextDate: Date } => {
  const currentDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const nextDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999));

  return { currentDate, nextDate };
};
