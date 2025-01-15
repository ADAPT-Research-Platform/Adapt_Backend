import express from 'express';

import {
  createUpdateAnswer,
  getAnswer,
} from '../controllers/answers';

const router = express.Router();

// Add a comment (root or reply)
router.post('/', createUpdateAnswer);

// Get comments for a chapter
router.get('/', getAnswer);

export default router;
