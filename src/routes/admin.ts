import express from 'express';

import AdminController from '../controllers/admin';

const router = express.Router();

router.route('/getAllUsers').get(AdminController.getAllUsers);
router.route('/getUser/:id').get(AdminController.getUsersById);

export default router;
