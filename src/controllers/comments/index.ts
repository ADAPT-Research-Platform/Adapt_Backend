import type { Request, Response } from 'express';

import { IsNull } from 'typeorm';

import createHttpError from 'http-errors';

import type {
  CommentResponse,
  GetCommentsResponse
} from 'src/types/routes/comments';

import { AppDataSource } from '../../data-source';
import { Comment } from '../../entities/comment';

/* export const addComment = async (
  req: Request<object, object, AddCommentBody>,
  res: Response<CommentResponse>
) => {
  const { chapterId, parentCommentId, content, userId } = req.body;

  if (!chapterId || !content || !userId) {
    throw createHttpError(
      400,
      'Chapter ID, content, and user ID are required.'
    );
  }

  try {
    const chapterRepo = AppDataSource.getRepository(Chapter);
    const userRepo = AppDataSource.getRepository(User);
    const commentRepo = AppDataSource.getRepository(Comment);

    const chapter = await chapterRepo.findOne({ where: { id: chapterId } });
    const user = await userRepo.findOne({ where: { id: userId } });

    if (!chapter || !user) {
      throw createHttpError(404, 'Chapter or user not found.');
    }

    let parentComment = null;
    if (parentCommentId) {
      parentComment = await commentRepo.findOne({
        where: { id: parentCommentId },
      });
      if (!parentComment) {
        throw createHttpError(404, 'Parent comment not found.');
      }
    }

    const comment = new Comment();
    comment.content = content;
    comment.chapter = chapter;
    comment.user = user;
    comment.parentComment = parentComment;

    const savedComment = await commentRepo.save(comment);

    // Build response as per the interface
    const response: CommentResponse = {
      id: savedComment.id,
      content: savedComment.content,
      createdAt: savedComment.createdAt,
      updatedAt: savedComment.updatedAt,
      user: {
        id: user.id,
        username: user.username,
      },
    };

    res.status(201).json(response);
  } catch (error) {
    throw createHttpError(500, 'Error adding comment');
  }
};*/

const getUserId = (req: Request): number => {
  if (!req.user || !req.user.id) {
    throw createHttpError(401, 'User not authenticated');
  }
  return req.user.id;
};

export const getComments = async (
  req: Request,
  res: Response<GetCommentsResponse>
) => {
  const userId = getUserId(req);
  const sectionId = parseInt(req.params.sectionId, 10);

  if (!sectionId) {
    throw createHttpError(400, 'Section ID is required.');
  }

  try {
    const commentRepo = AppDataSource.getRepository(Comment);

    // Fetch root comments (comments without a parent)
    const rootComments = await commentRepo.find({
      where: { section: { id: sectionId }, user: { id: userId }, parentId: IsNull() },
      relations: ['user'],
      order: { createdAt: 'ASC' }, // Optional: Order by creation time
    });

    // Recursive function to fetch replies
    const fetchReplies = async (
      parentId: number
    ): Promise<CommentResponse[]> => {
      const replies = await commentRepo.find({
        where: { parentId: { id: parentId } },
        relations: ['user'],
        order: { createdAt: 'ASC' }, // Optional: Order by creation time
      });

      return Promise.all(
        replies.map(async (reply) => ({
          id: reply.id,
          content: reply.content,
          createdAt: reply.createdAt,
          updatedAt: reply.updatedAt,
          user: {
            id: reply.user.id,
            username: reply.user.username,
          },
          replies: await fetchReplies(reply.id), // Recursive call
        }))
      );
    };

    // Map root comments and fetch their replies recursively
    const mappedComments: CommentResponse[] = await Promise.all(
      rootComments.map(async (comment) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        user: {
          id: comment.user.id,
          username: comment.user.username,
        },
        replies: await fetchReplies(comment.id),
      }))
    );

    const response: GetCommentsResponse = {
      sectionId: sectionId,
      comments: mappedComments,
    };

    res.status(200).json(response);
  } catch (error) {
    throw createHttpError(500, 'Error getting comments');
  }
};

/* export const updateComment = async (
  req: Request<{ commentId: string }, object, UpdateCommentBody>,
  res: Response<CommentResponse>
) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!commentId || !content) {
    throw createHttpError(400, 'Comment ID and content are required.');
  }

  try {
    const commentRepo = AppDataSource.getRepository(Comment);
    const comment = await commentRepo.findOne({
      where: { id: commentId },
      relations: ['user'], // Include user data for response
    });

    if (!comment) {
      throw createHttpError(404, 'Comment not found.');
    }

    comment.content = content;
    const updatedComment = await commentRepo.save(comment);

    // Build response as per the interface
    const response: CommentResponse = {
      id: updatedComment.id,
      content: updatedComment.content,
      createdAt: updatedComment.createdAt,
      updatedAt: updatedComment.updatedAt,
      user: {
        id: comment.user.id,
        username: comment.user.username,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    throw createHttpError(500, 'Error updating comment');
  }
};

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
