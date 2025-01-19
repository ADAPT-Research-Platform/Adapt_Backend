import type { Request, Response } from 'express';

import type { FindOperator } from 'typeorm';
import { Between, IsNull } from 'typeorm';

import createHttpError from 'http-errors';

import type {
  AddCommentBody,
  AddReplyBody,
  CommentResponse,
} from 'src/types/routes/comments';

import { AppDataSource } from '../../data-source';
import { Comment } from '../../entities/comment';
import logger from '../../logger';
import { Section } from '../../entities/section';
import { User } from '../../entities/user';
import { UserType } from '../../enums/enum';
import { getUserId } from '../users';

export const createComment = async (
  req: TypedRequestBody<AddCommentBody>,
  res: Response<CommentResponse>
) => {
  const { text, sectionId, sectionUserId } = req.body;
  const userId = getUserId(req);

  if (!text) {
    throw createHttpError(400, 'Comment text not specified!');
  }

  if (!sectionId) {
    throw createHttpError(400, 'Section Id not specified!');
  }

  try {
    const sectionRepo = AppDataSource.getRepository(Section);
    const userRepo = AppDataSource.getRepository(User);
    const commentRepo = AppDataSource.getRepository(Comment);

    const commentUser = await userRepo.findOne({ where: { id: userId } });
    if (!commentUser) {
      throw createHttpError(404, 'User not found!');
    }

    let sectionUser;
    if (commentUser.role === UserType.ADMIN) {
      // Admin always need to specify section User
      if (!sectionUserId) {
        throw createHttpError(404, 'SectionUserId Not specified by ADMIN!');
      }

      if (sectionUserId !== userId) {
        sectionUser = await userRepo.findOne({ where: { id: sectionUserId } });
        // Sends a notification to sectionUser
        logger.info(`Send a comment notification to user: ${sectionUserId} on section: ${sectionId}`);
      }
    } else {
      sectionUser = commentUser;
    }

    if (!sectionUser) {
      throw createHttpError(404, 'Section User not found!');
    }

    const section = await sectionRepo.findOne({ where: { id: sectionId } });

    if (!section) {
      throw createHttpError(404, 'Comment Section not found.');
    }

    const comment = new Comment();
    comment.text = text;
    comment.section = section;
    comment.sectionUser = sectionUser;
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
      relations: ['section', 'sectionUser'],
    });

    if (!parentComment) {
      throw createHttpError(404, 'Parent comment not found!');
    }

    // Create the reply
    const comment = new Comment();
    comment.text = text;
    comment.parent = parentComment;
    comment.section = parentComment.section;
    comment.sectionUser = parentComment.sectionUser;
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
  const { sectionId, date } = req.query;

  if (!sectionId && !date) {
    throw createHttpError(400, 'Either Section ID or Date must be provided.');
  }

  // Initialize the filter object
  const filter: {
    section?: { id: number };
    createdAt?: FindOperator<Date>; // Use FindOperator to allow `Between()`
    sectionUser: { id: number };
    parent: FindOperator<null>;
  } = { sectionUser: { id: userId }, parent: IsNull() };

  // Add sectionId filter if provided
  if (sectionId) {
    const sectionIdNumber = parseInt(sectionId as string, 10);
    if (isNaN(sectionIdNumber)) {
      throw createHttpError(400, 'Invalid Section ID.');
    }
    filter.section = { id: sectionIdNumber };
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
      relations: ['commentUser'],
      order: { createdAt: 'ASC' }, // Optional: Order by creation time
    });

    // Recursive function to fetch replies
    const fetchReplies = async (
      parentId: number
    ): Promise<CommentResponse[]> => {
      const replies = await commentRepo.find({
        where: { parent: { id: parentId } },
        relations: ['commentUser'],
        order: { createdAt: 'ASC' }, // Optional: Order by creation time
      });

      return Promise.all(
        replies.map(async (reply) => ({
          id: reply.id,
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

const getStartAndEndOfDate = (
  date: Date
): { currentDate: Date; nextDate: Date } => {
  const currentDate = new Date(date); // Clone the input date
  currentDate.setHours(0, 0, 0, 0); // Set to the beginning of the day (midnight)

  const nextDate = new Date(date); // Clone the input date
  nextDate.setHours(23, 59, 59, 999); // Set to the last millisecond of the day

  return { currentDate, nextDate };
};

/*
export const deleteComment = async (
  req: Request<{ commentId: string }>,
  res: Response<{ message: string }>
) => {
  const { commentId } = req.params;

  if (!commentId) {
    return res.status(400).json({ message: 'Comment ID is required.' });
  }

  try {
    const commentRepo = AppDataSource.getRepository(Comment);
    const comment = await commentRepo.findOne({ where: { id: commentId } });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    await commentRepo.softDelete(comment.id);

    res.status(200).json({ message: 'Comment deleted successfully.' });
  } catch (error) {
    throw createHttpError(500, 'Error deleting comment');
  }
};*/
