import type { Request, Response } from 'express';
import createHttpError from 'http-errors';

import { Between } from 'typeorm';

import jwt from 'jsonwebtoken';

import {
  generateVerificationToken,
  sendVerificationEmail,
} from '../../utils/utils';

import { Mood } from '../../entities/mood';

import { UserType } from '../../enums/enum';

import { AppDataSource } from '../../data-source';
import { User } from '../../entities/user';
import type { UsersCreateBody } from '../../types/routes/users';
import type { MoodCreateBody } from '../../types/routes/mood';
import { validateCreateBody } from './validators';
import logger from '../../logger';

const getUserId = (req: Request): number => {
  if (!req.user || !req.user.id) {
    throw createHttpError(401, 'User not authenticated');
  }
  return req.user.id;
};

const create = async (
  req: TypedRequestBody<UsersCreateBody>,
  res: Response
) => {
  const { username, email, password } = validateCreateBody(req.body);

  // Create a query runner
  const queryRunner = AppDataSource.createQueryRunner();

  try {
    // Connect and start transaction
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const userRepo = queryRunner.manager.getRepository(User);

    // Check if username already exists
    const usernameExists = await userRepo.findOne({ where: { username } });
    if (usernameExists) {
      throw createHttpError(409, 'Username already exists');
    }

    // Check if email already exists
    const emailExists = await userRepo.findOne({ where: { email } });
    if (emailExists) {
      throw createHttpError(409, 'Email already exists');
    }

    // Create and save the new user
    const newUser = new User();
    newUser.username = username;
    newUser.email = email;
    newUser.role = UserType.CLIENT;
    newUser.isVerified = false; // Add `isVerified` field to track email verification
    newUser.setPassword(password);
    await queryRunner.manager.save(newUser);

    // Generate verification token
    const verificationToken = generateVerificationToken(newUser.id.toString());

    // Send the verification email
    await sendVerificationEmail(email, verificationToken);

    // Commit the transaction
    await queryRunner.commitTransaction();

    res.status(201).send({
      id: newUser.id,
      message: 'User created. Please verify your email.',
    });
  } catch (err) {
    // Rollback the transaction on error
    if (queryRunner.isTransactionActive) {
      await queryRunner.rollbackTransaction();
    }

    // Log and handle the error
    console.error('Error creating user:', err);
    // Handle known error types
    if (err instanceof createHttpError.HttpError) {
      res.status(err.status).send(err.message);
    } else if (err instanceof Error) {
      res.status(500).send(err.message || 'Internal Server Error');
    } else {
      res.status(500).send('An unknown error occurred');
    }
  } finally {
    // Release the query runner
    await queryRunner.release();
  }
};

const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).send('Invalid or missing token.');
  }

  // Create a query runner
  const queryRunner = AppDataSource.createQueryRunner();

  try {
    // Connect and start transaction
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const userRepo = queryRunner.manager.getRepository(User);

    // Decode the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
    const userId = (decoded as { id: string }).id;

    // Find the user by ID
    const user = await userRepo.findOne({ where: { id: Number(userId) } });
    if (!user) {
      throw createHttpError(404, 'User not found.');
    }

    if (user.isVerified) {
      throw createHttpError(400, 'Email already verified.');
    }

    // Mark the user as verified
    user.isVerified = true;
    await queryRunner.manager.save(user);

    // Commit the transaction
    await queryRunner.commitTransaction();

    // Send success response
    res.status(200).send('Email verified successfully!');
  } catch (err) {
    // Rollback the transaction on error
    if (queryRunner.isTransactionActive) {
      await queryRunner.rollbackTransaction();
    }

    // Handle known error types
    if (err instanceof createHttpError.HttpError) {
      res.status(err.status).send(err.message);
    } else if (err instanceof Error) {
      res.status(400).send(err.message || 'Invalid or expired token.');
    } else {
      res.status(500).send('An unknown error occurred.');
    }
  } finally {
    // Release the query runner
    await queryRunner.release();
  }
};

export const createMood = async (req: Request, res: Response) => {
  // Explicitly cast the request to include user
  const { user } = req as Request & { user: { id: string } };

  if (!user) {
    throw createHttpError(403, 'User must be authenticated');
  }

  const userId = user.id; // Access user ID
  const { feeling, motivation } = req.body as MoodCreateBody;

  if (!feeling || !motivation) {
    throw createHttpError(400, 'Feeling and motivation are required');
  }
  if (feeling < 1 || feeling > 5 || motivation < 1 || motivation > 5) {
    throw createHttpError(
      400,
      'Feeling and motivation must be between 1 and 5'
    );
  }

  const today = new Date().toISOString().split('T')[0];

  const moodRepo = AppDataSource.getRepository(Mood);

  const existingMood = await moodRepo.findOne({
    where: { user: { id: userId }, createdAt: new Date(today) },
  });
  if (existingMood) {
    throw createHttpError(409, 'Mood entry already exists for today');
  }

  const mood = moodRepo.create({
    user,
    feeling,
    motivation,
  });

  await moodRepo.save(mood);

  return res.status(201).json({
    message: 'Mood recorded successfully',
    moodId: mood.id,
  });
};

export const getUserMood = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { startDate, endDate } = req.query;

  if (!startDate && !endDate) {
    throw createHttpError(400, 'Date Range is nor provided');
  }

  const parsedStartDate = new Date(startDate as string);
  if (isNaN(parsedStartDate.getTime())) {
    throw createHttpError(400, 'Invalid Start Date.');
  }

  const parsedEndDate = new Date(endDate as string);
  if (isNaN(parsedStartDate.getTime())) {
    throw createHttpError(400, 'Invalid End Date.');
  }

  try {
    const moodRepo = AppDataSource.getRepository(Mood);

    // Query moods within the specified date range
    logger.info(
      `${parsedStartDate.toISOString()} ${parsedEndDate.toISOString()}`
    );
    const moods = await moodRepo.find({
      where: {
        user: { id: userId },
        createdAt: Between(parsedStartDate, parsedEndDate),
      },
      order: { createdAt: 'DESC' },
    });

    // Generate a list of strings
    const modeData: string[] = moods.map(
      (comment) =>
        `${comment.createdAt.toISOString()}|${comment.feeling}|${
          comment.motivation
        }`
    );

    res.status(200).json(modeData);
  } catch (error) {
    logger.error(error);
    throw createHttpError(500, 'Error getting mode data');
  }
};

export default {
  create,
  createMood,
  getUserMood,
  verifyEmail,
};
