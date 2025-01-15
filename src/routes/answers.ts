import express from 'express';

import {
  addAnswer,
  getAnswer,
} from '../controllers/answers';

const router = express.Router();

// Add a comment (root or reply)
router.post('/', addAnswer);

// Get comments for a chapter
router.get('/', getAnswer);

export default router;
