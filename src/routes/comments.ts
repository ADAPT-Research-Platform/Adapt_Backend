import express from 'express';

import {
  getComments,
} from '../controllers/comments';

const router = express.Router();

// Add a comment (root or reply)
// router.post('/', addComment);

// Get comments for a chapter
router.get('/:sectionId', getComments);

// Update a comment
// router.put('/:commentId', updateComment);

// Delete a comment
// router.delete('/:commentId', deleteComment);

export default router;
