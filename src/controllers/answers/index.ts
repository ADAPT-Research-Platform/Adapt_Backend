import type { Request, Response } from 'express';
import createHttpError from 'http-errors';

import { AppDataSource } from '../../data-source';
import type { AddAnswerBody, GetAnswerBody } from '../../types/routes/answers';
import { Answer } from '../../entities/answer';
import { getUserId } from '../users';

export const createUpdateAnswer = async (
  req: TypedRequestBody<AddAnswerBody>,
  res: Response<GetAnswerBody>
) => {
  const { sectionId, text } = req.body;
  const userId = getUserId(req);

  if (!sectionId) {
    throw createHttpError(400, 'Section not specified!');
  }

  if (!text) {
    throw createHttpError(400, 'Answer map not specified!');
  }

  // Create a query runner for transactional operations
  const queryRunner = AppDataSource.createQueryRunner();

  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const answerRepo = queryRunner.manager.getRepository(Answer);

    // Check if the answer already exists
    const existingAnswer = await answerRepo.findOne({
      where: { userId, sectionId },
    });

    if (existingAnswer) {
      // Update the existing answer
      existingAnswer.text = text;
      existingAnswer.updatedAt = new Date();
      await queryRunner.manager.save(existingAnswer);

      // Commit transaction
      await queryRunner.commitTransaction();

      return res.sendStatus(200);
    }

    // Create a new answer if it doesn't exist
    const newAnswer = new Answer();
    newAnswer.userId = userId;
    newAnswer.sectionId = sectionId;
    newAnswer.text = text;

    await queryRunner.manager.save(newAnswer);

    // Commit transaction
    await queryRunner.commitTransaction();

    return res.sendStatus(201);
  } catch (err) {
    // Rollback transaction on error
    if (queryRunner.isTransactionActive) {
      await queryRunner.rollbackTransaction();
    }

    console.error('Error in Answer Add/Update:', err);

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

export const getAnswer = async (
  req: Request,
  res: Response<GetAnswerBody>
) => {
  const userId = getUserId(req);
  const { sectionId } = req.query;

  if (!sectionId) {
    throw createHttpError(400, 'Section id should be specified!');
  }

  const sectionIdNumber = parseInt(sectionId as string, 10);
  if (isNaN(sectionIdNumber)) {
    throw createHttpError(400, 'Invalid Section Id!');
  }

  try {
    const answerRepo = AppDataSource.getRepository(Answer);

    // Fetch the answer for the given user and section
    const answer = await answerRepo.findOne({
      where: { userId, sectionId: sectionIdNumber },
    });

    if (!answer) {
      throw createHttpError(404, 'Answer not found');
    }

    // Return the found answer
    res.status(200).send({
      sectionId: answer.sectionId,
      updatedAt: answer.updatedAt,
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

