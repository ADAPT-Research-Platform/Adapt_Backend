import express from 'express';

import {
  createComment,
  createReply,
  getComments,
} from '../controllers/comments';

const router = express.Router();

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Add a new comment
 *     tags:
 *       - Comments
 */
router.post('/', createComment);

/**
 * @swagger
 * /comments/reply:
 *   post:
 *     summary: Add a reply to a comment
 *     tags:
 *       - Comments
 */
router.route('/reply').post(createReply);

/**
 * @swagger
 * /comments:
 *   get:
 *     summary: Get comments for a chapter
 *     tags:
 *       - Comments
 */
router.get('/', getComments);

// Uncomment and document these routes when implemented:

// /**
//  * @swagger
//  * /comments/{commentId}:
//  *   put:
//  *     summary: Update a comment
//  *     tags:
//  *       - Comments
//  *     parameters:
//  *       - name: commentId
//  *         in: path
//  *         required: true
//  *         schema:
//  *           type: string
//  */
// router.put('/:commentId', updateComment);

// /**
//  * @swagger
//  * /comments/{commentId}:
//  *   delete:
//  *     summary: Delete a comment
//  *     tags:
//  *       - Comments
//  *     parameters:
//  *       - name: commentId
//  *         in: path
//  *         required: true
//  *         schema:
//  *           type: string
//  */
// router.delete('/:commentId', deleteComment);

export default router;
