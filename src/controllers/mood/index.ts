import type { Request, Response } from 'express';
import createHttpError from 'http-errors';

import { Between } from 'typeorm';

import { Mood } from '../../entities/mood';
import { AppDataSource } from '../../data-source';
import type { CreateMoodBody } from '../../types/routes/users';
import logger from '../../logger';
import { getUserId } from '../users';

export const createUpdateMood = async (
  req: TypedRequestBody<CreateMoodBody>,
  res: Response
) => {
  const { feeling, motivation } = req.body;
  const userId = getUserId(req);

  // Input validation
  if (!feeling || !motivation) {
    throw createHttpError(400, 'Both feeling and motivation are required!');
  }

  if (feeling < 1 || feeling > 4) {
    // Valid values: 1 (Happy), 2 (Sad), 3 (Angry), 4 (Tired)
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
    logger.error('Error creating or updating mood:', err);
    throw createHttpError(500, 'An error occurred while processing your request.');
  }
};

export const getMoods = async (req: Request, res: Response) => {
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
        createdDate: Between(parsedStartDate, parsedEndDate),
      },
      order: { createdDate: 'DESC' },
    });

    // Generate a list of strings
    const modeData: string[] = moods.map(
      (data) => `${data.createdDate}|${data.feeling}|${data.motivation}`
    );

    res.status(200).json(modeData);
  } catch (error) {
    logger.error('Error getting mood data:', error);
    throw createHttpError(500, 'An error occurred while processing your request.');
  }
};

export default {
  createMood: createUpdateMood,
  getUserMood: getMoods,
};
