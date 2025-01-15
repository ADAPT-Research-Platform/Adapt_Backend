import type { Request, Response } from 'express';
import createHttpError from 'http-errors';

import { AppDataSource } from '../../data-source';
import type { AddAnswerBody, GetAnswerBody } from '../../types/routes/answers';
import { Answer } from '../../entities/answer';

const getUserId = (req: Request): number => {
  if (!req.user || !req.user.id) {
    throw createHttpError(401, 'User not authenticated');
  }
  return req.user.id;
};

export const addAnswer = async (
  req: TypedRequestBody<AddAnswerBody>,
  res: Response<GetAnswerBody | { error: string }>
) => {
  const { sectionId, text } = req.body;
  const userId = getUserId(req);

  // Validate input
  if (!text || !sectionId) {
    throw createHttpError(400, 'Answer text or sectionId not specified');
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

      return res.status(200).send({
        sectionId: existingAnswer.sectionId,
        updatedAt: existingAnswer.updatedAt,
        text: existingAnswer.text,
      });
    }

    // Create a new answer if it doesn't exist
    const newAnswer = new Answer();
    newAnswer.userId = userId;
    newAnswer.sectionId = sectionId;
    newAnswer.text = text;

    const savedAnswer = await queryRunner.manager.save(newAnswer);

    // Commit transaction
    await queryRunner.commitTransaction();

    res.status(201).send({
      sectionId: savedAnswer.sectionId,
      updatedAt: savedAnswer.updatedAt,
      text: savedAnswer.text,
    });
  } catch (err) {
    // Rollback transaction on error
    if (queryRunner.isTransactionActive) {
      await queryRunner.rollbackTransaction();
    }

    console.error('Error adding/updating answer:', err);

    // Handle errors gracefully
    if (err instanceof createHttpError.HttpError) {
      throw createHttpError(err.status, err.message);
    } else {
      throw createHttpError(500, 'Internal Server Error');
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
    throw createHttpError(400, 'Section id should be specified');
  }

  const sectionIdNumber = parseInt(sectionId as string, 10);
  if (isNaN(sectionIdNumber)) {
    throw createHttpError(400, 'Invalid section id format');
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
      throw createHttpError(err.status, err.message);
    } else {
      throw createHttpError(500, 'Internal Server Error');
    }
  }
};

