import express from 'express';

import UsersController from '../controllers/users_controller';

const router = express.Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Users
 */
router.route('/').post(UsersController.create);

/**
 * @swagger
 * /users:
 *   put:
 *     summary: Update an existing user
 *     tags:
 *       - Users
 */
router.route('/').put(UsersController.update);

/**
 * @swagger
 * /users:
 *   delete:
 *     summary: Disable a user account
 *     tags:
 *       - Users
 */
router.route('/').delete(UsersController.disable);

export default router;
