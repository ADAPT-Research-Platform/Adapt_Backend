import express from 'express';

import AdminController from '../controllers/admin';

const router = express.Router();

router.route('/getAllUsers').get(AdminController.getAllUsers);
router.route('/getUser/:id').get(AdminController.getUsersById);
router.route('/getUserProgress/:userId').get(AdminController.getUserProgress);
router.route('/getUserMoods/:userId').get(AdminController.getUserMoodById);
router.route('/user/resetUserPassword').put(AdminController.resetUserPassword);
router.route('/user/deleteRequest').get(AdminController.getAllDisabledUserAccount);
router.route('/deleteUser/:userId').delete(AdminController.deleteUserPermanently);

export default router;
