import express from 'express';

import {
  createComment,
  createReply,
  getComments,
} from '../controllers/comments';

const router = express.Router();

// Add a comment (root or reply)
router.post('/', createComment);

// Add a comment (root or reply)
router.post('/reply', createReply);

// Get comments for a chapter
router.get('/', getComments);

// Update a comment
// router.put('/:commentId', updateComment);

// Delete a comment
// router.delete('/:commentId', deleteComment);

export default router;
