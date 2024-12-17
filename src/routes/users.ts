import express from 'express';

import UsersController from '../controllers/users';

const router = express.Router();

router.route('/').post(UsersController.create);
router.route('/mood').post(UsersController.createMood);

export default router;