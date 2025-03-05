import express from 'express';

import { createUpdateProgress } from '../controllers/modules_controller';

const router = express.Router();

/**
 * @swagger
 * /progress:
 *   post:
 *     summary: Add or update user progress
 *     tags:
 *       - Progress
 */
router.post('/', createUpdateProgress);

export default router;
