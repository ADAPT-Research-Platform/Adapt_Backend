import type { Request, Response } from 'express';
import createHttpError from 'http-errors';

import { Between } from 'typeorm';

import { Mood } from '../../entities/mood';

import { UserType } from '../../enums/enum';

import { AppDataSource } from '../../data-source';
import { User } from '../../entities/user';
import type { UsersCreateBody } from '../../types/routes/users';
import type { MoodCreateBody } from '../../types/routes/mood';
import { validateCreateBody } from './validators';

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
    newUser.setPassword(password);
    await queryRunner.manager.save(newUser);

    // Commit the transaction
    await queryRunner.commitTransaction();

    res.status(201).send({ id: newUser.id });
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
    motivation
  });

  await moodRepo.save(mood);

  return res.status(201).json({
    message: 'Mood recorded successfully',
    moodId: mood.id,
  });
};

export const getUserMood = async (req: Request, res: Response) => {
  // Explicitly cast the request to include userId
  const { userId } = req as Request & { userId: number };

  if (!userId) {
    throw createHttpError(403, 'User must be authenticated');
  }
  console.log(userId);

  // Check for 'days' query parameter with default value
  const daysParam = req.query.days;
  const days = daysParam ? parseInt(daysParam as string, 10) : 7; // Default to 7 days

  if (isNaN(days) || days <= 0) {
    throw createHttpError(400, '\'days\' must be a positive integer');
  }

  // Calculate the date range
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - days);

  const moodRepo = AppDataSource.getRepository(Mood);

  // Query moods within the specified date range
  const moods = await moodRepo.find({
    where: {
      user: { id: userId },
      createdAt: Between(startDate, today),
    },
    order: { createdAt: 'DESC' },
  });
  
  return res.status(200).json(
      moods,
  );
};

export default {
  create,
  createMood,
  getUserMood,
};
