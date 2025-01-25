import express from 'express';

import UsersController from '../controllers/users';

const router = express.Router();

router.route('/').post(UsersController.create);
router.route('/').put(UsersController.update);
router.route('/').delete(UsersController.disable);

export default router;
