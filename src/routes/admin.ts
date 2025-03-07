import express from 'express';

import { isAdmin } from '../middlewares/auth';

import AdminController from '../controllers/admin_controller';

const router = express.Router();

/**
 * @swagger
 * /getAllUsers:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Admin
 */
router.route('/getAllUsers').get(AdminController.getAllUsers);

/**
 * @swagger
 * /getUser/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags:
 *       - Admin
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 */
router.route('/getUser/:id').get(AdminController.getUsersById);

/**
 * @swagger
 * /getUserProgress/{userId}:
 *   get:
 *     summary: Get user progress
 *     tags:
 *       - Admin
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 */
router.route('/getUserProgress/:userId').get(AdminController.getUserProgress);

/**
 * @swagger
 * /getUserMoods/{userId}:
 *   get:
 *     summary: Get user moods
 *     tags:
 *       - Admin
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 */
router.route('/getUserMoods/:userId').get(AdminController.getUserMoodById);

/**
 * @swagger
 * /user/resetUserPassword:
 *   put:
 *     summary: Reset user password
 *     tags:
 *       - Admin
 */
router.route('/user/resetUserPassword').put(AdminController.resetUserPassword);

/**
 * @swagger
 * /user/deleteRequest:
 *   get:
 *     summary: Get all disabled user accounts
 *     tags:
 *       - Admin
 */
router.route('/user/deleteRequest').get(AdminController.getAllDisabledUserAccount);

/**
 * @swagger
 * /deleteUser/{userId}:
 *   delete:
 *     summary: Permanently delete a user
 *     tags:
 *       - Admin
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 */
router.route('/deleteUser/:userId').delete(AdminController.deleteUserPermanently);

/**
 * @swagger
 * /user/archiveData:
 *   get:
 *     summary: Download data for given user or all
 *     tags:
 *       - Admin
 */
router.route('/archiveData/:userId').get(isAdmin, AdminController.archiveData);

export default router;
