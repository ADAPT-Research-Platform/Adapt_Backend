import express from 'express';

import {
  createUpdateMood,
  getMoods,
} from '../controllers/mood';

const router = express.Router();

// Add/Update (root or reply)
router.post('/', createUpdateMood);

// Get comments for a chapter
router.get('/', getMoods);

export default router;
