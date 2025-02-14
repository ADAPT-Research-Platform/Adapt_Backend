import type { Response } from 'express';
import createHttpError from 'http-errors';

import { AppDataSource } from '../../data-source';
import { getUserId } from '../users';
import type { CreateUserTrackBody } from '../../types/track';
import { Track } from '../../entities/track';

export const createTrack = async (
  req: TypedRequestBody<CreateUserTrackBody>,
  res: Response
) => {
  const { startedAt, endedAt } = req.body;
  const userId = getUserId(req); // Implement this to get the authenticated user ID

  // Validate input
  if (!startedAt || !endedAt) {
    throw createHttpError(400, 'Both startedAt and endedAt are required!');
  }

  const trackRepo = AppDataSource.getRepository(Track);

  try {
    // Try to find an existing tracks record for the given userId and startedAt
    const existingTrack = await trackRepo.findOne({
      where: { userId, startedAt: new Date(startedAt) },
    });

    if (existingTrack) {
      // Update the endedAt field if the record already exists
      existingTrack.endedAt = endedAt;
      await trackRepo.save(existingTrack);
      return res.sendStatus(200); // Updated successfully
    }

    // Otherwise, create a new tracks record
    const newTrack = trackRepo.create({
      userId,
      startedAt: startedAt,
      endedAt: endedAt,
    });

    await trackRepo.save(newTrack);
    return res.sendStatus(201); // Created successfully
  } catch (err) {
    console.error('Error creating track:', err);

    // Handle errors gracefully
    if (err instanceof createHttpError.HttpError) {
      throw err;
    } else {
      throw createHttpError(500, 'Internal Server Error');
    }
  }
};
