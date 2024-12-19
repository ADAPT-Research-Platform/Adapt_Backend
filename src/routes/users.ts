import express from 'express';

import { isAuthenticated } from '../middlewares/auth';

import UsersController from '../controllers/users';

const router = express.Router();

router.route('/').post(UsersController.create);
router.route('/mood').post(isAuthenticated, UsersController.createMood);
router.route('/mood').get(isAuthenticated, UsersController.getUserMood);

export default router;
