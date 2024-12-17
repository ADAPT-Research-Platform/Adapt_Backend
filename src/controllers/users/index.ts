import type { Request, Response } from 'express';
import createHttpError from 'http-errors';

import { Between } from 'typeorm';

import { Mood } from '../../entities/mood';

import { UserType } from '../../enums/enum';

import { AppDataSource } from '../../data-source';
import { User } from '../../entities/user';
import type { UsersCreateBody } from '../../types/routes/users';
import type { MoodCreateBody } from '../../types/routes/mood';
import { validateCreateBody, validateMoodCreateBody } from './validators';

const create = async (
  req: TypedRequestBody<UsersCreateBody>,
  res: Response
) => {
  const { username, email, password } = validateCreateBody(req.body);

  // Create a query runner to control the transactions, it allows to cancel the transaction if we need to
  const queryRunner = AppDataSource.createQueryRunner();

  // Connect the query runner to the database and start the transaction
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const userRepo = queryRunner.manager.getRepository(User);
    const usernameExists = await userRepo.exists({
      where: { username },
    });
    if (usernameExists) {
      throw createHttpError(409, 'Username already exists');
    }

    const emailExists = await userRepo.exist({
      where: { email },
    });
    if (emailExists) {
      throw createHttpError(409, 'Email already exists');
    }

    const newUser = new User();
    newUser.username = username;
    newUser.email = email;
    newUser.role = UserType.USER;
    newUser.setPassword(password);
    await queryRunner.manager.save(newUser);

    // No exceptions occured, so we commit the transaction
    await queryRunner.commitTransaction();

    res.send(newUser.id);
  } catch (err) {
    // As an exception occured, cancel the transaction
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    // We need to release the query runner to not keep a useless connection to the database
    await queryRunner.release();
  }
};

export const createMood = async (
  req: TypedRequestBody<MoodCreateBody>,
  res: Response
) => {
  const { userId, feeling, motivation, date } = validateMoodCreateBody(
    req.body
  );

  // Create a query runner to control the transaction
  const queryRunner = AppDataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const userRepo = queryRunner.manager.getRepository(User);
    const moodRepo = queryRunner.manager.getRepository(Mood);

    // Check if the user exists
    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    // Check if the mood already exists for the given date
    const existingMood = await moodRepo.findOne({
      where: { user: { id: userId }, date: new Date(date) },
    });
    if (existingMood) {
      throw createHttpError(409, 'Mood entry already exists for this date');
    }

    // Create new mood entry
    const newMood = new Mood();
    newMood.user = user;
    newMood.feeling = feeling;
    newMood.motivation = motivation;
    newMood.date = new Date(date);

    // Save the mood entry
    await queryRunner.manager.save(newMood);

    // Commit the transaction
    await queryRunner.commitTransaction();

    res.status(201).send({ id: newMood.id });
  } catch (err) {
    // Rollback the transaction on error
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    // Release the query runner
    await queryRunner.release();
  }
};

export const getUserMood = async (req: Request, res: Response) => {
  // Explicitly cast the request to include userId
  const { userId } = req as Request & { userId: string };

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
      date: Between(startDate, today),
    },
    order: { date: 'DESC' },
  });

  return res.status(200).json({
    message: `Mood entries for the last ${days} days`,
    data: moods,
  });
};

export default {
  create,
  createMood,
  getUserMood,
};
