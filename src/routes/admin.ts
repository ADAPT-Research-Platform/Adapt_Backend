import express from 'express';

import AdminController from '../controllers/admin';

const router = express.Router();

router.route('/getAllUsers').get(AdminController.getAllUsers);
router.route('/getUser/:id').get(AdminController.getUsersById);
router.route('/getUserProgress/:userId').get(AdminController.getUserProgress);
router.route('/getUserMoods/:userId').get(AdminController.getUserMoodById);

router.route('/changeUserRole/:id').put(AdminController.changeUserRole);

export default router;
