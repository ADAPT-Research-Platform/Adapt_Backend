import express from 'express';

import AdminController from '../controllers/admin';

const router = express.Router();

router.route('/getAllUsers').get(AdminController.getAllUsers);
router.route('/getUser/:id').get(AdminController.getUsersById);
router.route('/getUserProgress/:userId').get(AdminController.getUserProgress); //TODO: Try to make this into little methods like the app.
router.route('/getUserMoods/:userId').get(AdminController.getUserMoodById);

export default router;
