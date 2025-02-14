import express from 'express';

import {
  createTrack,
} from '../controllers/tracks';

const router = express.Router();

/**
 * @swagger
 * /tracks:
 *   post:
 *     summary: Track user app usage
 *     tags:
 *       - Users
 */
router.route('/').post(createTrack);

export default router;
