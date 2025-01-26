import express from 'express';

import {
  createUpdateAnswer,
  getAnswer,
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
 *     summary: Get answers for a chapter
 *     tags:
 *       - Answers
 */
router.get('/', getAnswer);

export default router;
