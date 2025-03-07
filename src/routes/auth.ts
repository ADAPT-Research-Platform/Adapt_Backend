import express from 'express';

import AuthController from '../controllers/auth_controller';
import { isAuthenticated, isUnauthenticated } from '../middlewares/auth';

const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags:
 *       - Auth
 */
router.route('/login').post(isUnauthenticated, AuthController.login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     tags:
 *       - Auth
 */
router.route('/logout').post(isAuthenticated, AuthController.logout);

/**
 * @swagger
 * /auth/get:
 *   get:
 *     summary: Get authenticated user details
 *     tags:
 *       - Auth
 */
router.route('/get').get(isAuthenticated, AuthController.get);

/**
 * @swagger
 * /auth/authenticated:
 *   get:
 *     summary: Check if user is authenticated
 *     tags:
 *       - Auth
 */
router.route('/authenticated').get(AuthController.authenticated);

/**
 * @swagger
 * /auth/verify-cookie:
 *   get:
 *     summary: Verify authentication cookie
 *     tags:
 *       - Auth
 */
router.route('/verify-cookie').get(AuthController.verifyCookie);

export default router;
