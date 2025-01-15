import express from 'express';

import AdminController from '../controllers/admin';

const router = express.Router();

router.route('/').get(AdminController.getAllUsers);

export default router;
