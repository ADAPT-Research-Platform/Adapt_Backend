import express from 'express';

import {
  createUpdateAnswer,
  getAnswerByChapterId,
  getAnswersByDate,
} from '../controllers/answers';

const router = express.Router();

/**
 * @swagger
 * /answers:
 *   post:
 *     summary: Add or update an answer
 *     tags:
 *       - Answers
 */
router.post('/', createUpdateAnswer);

/**
 * @swagger
 * /answers:
 *   get:
 *     summary: Get answer for a chapter
 *     tags:
 *       - Answers
 */
router.get('/getByChapterId', getAnswerByChapterId);

/**
 * @swagger
 * /answers:
 *   get:
 *     summary: Get answers by a date
 *     tags:
 *       - Answers
 */
router.get('/getByDate', getAnswersByDate);

export default router;
