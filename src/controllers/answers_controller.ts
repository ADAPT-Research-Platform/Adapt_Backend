import type { Request, Response } from 'express';
import createHttpError from 'http-errors';

import { Between } from 'typeorm';

import { AppDataSource } from '../data-source';
import type { AddAnswerBody, GetAnswerBody } from '../types/answers';
import { Answer } from '../entities/answer';
import { getUserId } from './users_controller';
import logger from '../utils/logger';

import { getStartAndEndOfDate } from './comments_controller';

export const createUpdateAnswer = async (
  req: TypedRequestBody<AddAnswerBody>,
  res: Response<GetAnswerBody>
) => {
  const { chapterId, text } = req.body;
  const userId = getUserId(req);

  if (!chapterId) {
    throw createHttpError(400, 'Chapter not specified!');
  }

  if (!text) {
    throw createHttpError(400, 'Answer map not specified!');
  }

  // Create a query runner for transactional operations
  const queryRunner = AppDataSource.createQueryRunner();

  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // Create a new answer if it doesn't exist
    const newAnswer = new Answer();
    newAnswer.userId = userId;
    newAnswer.chapterId = chapterId;
    newAnswer.text = text;
    newAnswer.createdAt = new Date();

    await queryRunner.manager.save(newAnswer);

    // Commit transaction
    await queryRunner.commitTransaction();

    return res.sendStatus(201);
  } catch (err) {
    // Rollback transaction on error
    if (queryRunner.isTransactionActive) {
      await queryRunner.rollbackTransaction();
    }

    console.error('Error in Answer Add:', err);

    // Handle errors gracefully
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

export const getAnswerByChapterId = async (
  req: Request,
  res: Response<GetAnswerBody>
) => {
  const userId = getUserId(req);
  const { chapterId } = req.query;

  if (!chapterId) {
    throw createHttpError(400, 'Chapter id should be specified!');
  }

  const chapterIdNumber = parseInt(chapterId as string, 10);
  if (isNaN(chapterIdNumber)) {
    throw createHttpError(400, 'Invalid Chapter Id!');
  }

  try {
    const answerRepo = AppDataSource.getRepository(Answer);

    // Fetch the answer for the given user and chapter
    const answer = await answerRepo.findOne({
      where: { userId, chapterId: chapterIdNumber },
      relations: ['chapter'],
      order: { createdAt: 'DESC' }
    });

    if (!answer) {
      throw createHttpError(404, 'Answer not found');
    }

    // Return the found answer
    res.status(200).send({
      chapterId: answer.chapterId,
      moduleId: answer.chapter.moduleId,
      chapterIndex: answer.chapter.index,
      updatedAt: answer.createdAt,
      text: answer.text,
    });
  } catch (err) {
    console.error('Error fetching answer:', err);

    // Handle errors gracefully
    if (err instanceof createHttpError.HttpError) {
      throw err;
    } else {
      throw createHttpError(500, 'Internal Server Error');
    }
  }
};

export const getAnswersByDate = async (
  req: Request,
  res: Response<GetAnswerBody[]>
) => {
  const userId = getUserId(req);
  const { date } = req.query;

  if (!date) {
    throw createHttpError(400, 'Date should be specified!');
  }
  
  // Add date filter if provided (comparing only the date part)
  const parsedDate = new Date(date as string);
  if (isNaN(parsedDate.getTime())) {
    throw createHttpError(400, 'Invalid Date.');
  }

  const { currentDate, nextDate } = getStartAndEndOfDate(parsedDate);

  // Log date range to check correctness
  logger.info(`Filter Range: ${currentDate.toISOString()} - ${nextDate.toISOString()}`);
  
  try {
    const answerRepo = AppDataSource.getRepository(Answer);

    // Fetch the answer for the given user and chapter
    const answers = await answerRepo.find({
      where: { userId, createdAt: Between(currentDate, nextDate) },
      relations: ['chapter'],
      order: { createdAt: 'DESC' }, // Ensure all records are fetched in order
    });

    logger.info(`Size: ${answers.length}`);

    const mappedAnswers: GetAnswerBody[] = answers.map((answer) => ({
      chapterId: answer.chapterId,
      moduleId: answer.chapter.moduleId,
      chapterIndex: answer.chapter.index,
      updatedAt: answer.createdAt,
      text: answer.text,
    }));
    
    res.status(200).json(mappedAnswers);
  } catch (err) {
    console.error('Error fetching answer:', err);

    // Handle errors gracefully
    if (err instanceof createHttpError.HttpError) {
      throw err;
    } else {
      throw createHttpError(500, 'Internal Server Error');
    }
  }
};
