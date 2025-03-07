import express from 'express';

import {
  createUpdateMood,
  getMoods,
} from '../controllers/mood_controller';

const router = express.Router();

/**
 * @swagger
 * /moods:
 *   post:
 *     summary: Add or update a mood entry
 *     tags:
 *       - Moods
 */
router.post('/', createUpdateMood);

/**
 * @swagger
 * /moods:
 *   get:
 *     summary: Get mood entries
 *     tags:
 *       - Moods
 */
router.get('/', getMoods);

export default router;
