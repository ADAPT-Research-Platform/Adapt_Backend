import type { Request, Response } from 'express';
import createHttpError from 'http-errors';

import { Between } from 'typeorm';

import { Mood } from '../entities/mood';
import { AppDataSource } from '../data-source';
import type { CreateMoodBody } from '../types/mood';
import logger from '../utils/logger';
import { getUserId } from './users_controller';

export const createUpdateMood = async (
  req: TypedRequestBody<CreateMoodBody>,
  res: Response
) => {
  const { feeling, motivation } = req.body;
  const userId = getUserId(req);

  // Input validation
  if (feeling === undefined || motivation === undefined) {
    throw createHttpError(400, 'Both feeling and motivation are required!');
  }

  if (feeling < 0 || feeling > 4) {
    // Valid values: 0(None), 1 (Happy), 2 (Sad), 3 (Angry), 4 (Tired)
    throw createHttpError(400, 'Feeling must be between 1 and 4');
  }

  if (motivation < 0 || motivation > 10) {
    throw createHttpError(400, 'Motivation must be between 0 and 10');
  }

  const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD format
  const moodRepo = AppDataSource.getRepository(Mood);

  try {
    // Check if a mood entry for today exists
    const existingMood = await moodRepo.findOne({
      where: { userId, createdDate: new Date(today) },
    });

    if (existingMood) {
      // Update existing mood entry
      existingMood.feeling = feeling;
      existingMood.motivation = motivation;
      existingMood.createdAt = new Date();
      await moodRepo.save(existingMood);
      return res.sendStatus(200); // Status 200 for updated entry
    }

    // Create a new mood entry
    const newMood = moodRepo.create({
      userId,
      feeling,
      motivation,
    });

    await moodRepo.save(newMood);
    return res.sendStatus(201); // Status 201 for new entry
  } catch (err) {
    console.error('Error add/update mood by date:', err);

    // Handle errors gracefully
    if (err instanceof createHttpError.HttpError) {
      throw err;
    } else {
      throw createHttpError(500, 'Internal Server Error');
    }
  }
};

export const getMoods = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { startDate, endDate } = req.query;

  if (!startDate && !endDate) {
    throw createHttpError(400, 'Date Range is nor provided!');
  }

  const parsedStartDate = new Date(startDate as string);
  if (isNaN(parsedStartDate.getTime())) {
    throw createHttpError(400, 'Invalid Start Date!');
  }

  const parsedEndDate = new Date(endDate as string);
  if (isNaN(parsedStartDate.getTime())) {
    throw createHttpError(400, 'Invalid End Date!');
  }

  try {
    const moodRepo = AppDataSource.getRepository(Mood);

    // Query moods within the specified date range
    logger.info(`StartDate: ${parsedStartDate.toISOString()} EndDate: ${parsedEndDate.toISOString()}`);

    const moods = await moodRepo.find({
      where: {
        user: { id: userId },
        createdDate: Between(parsedStartDate, parsedEndDate),
      },
      order: { createdDate: 'ASC' },
    });

    // Generate a list of strings
    const modeData: string[] = moods.map(
      (data) => `${data.createdDate}|${data.feeling}|${data.motivation}`
    );

    res.status(200).json(modeData);
  } catch (err) {
    console.error('Error get mood by date range:', err);

    // Handle errors gracefully
    if (err instanceof createHttpError.HttpError) {
      throw err;
    } else {
      throw createHttpError(500, 'Internal Server Error');
    }
  }
};

export default {
  createMood: createUpdateMood,
  getUserMood: getMoods,
};
