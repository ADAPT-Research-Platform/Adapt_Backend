import express from 'express';

import UsersController from '../controllers/users';

const router = express.Router();

router.route('/').post(UsersController.create);
router.route('/verify-email').get(UsersController.verifyEmail);

export default router;
