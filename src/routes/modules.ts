import express from 'express';

import { asyncHandler } from '../utils/utils';

import {
  getDiaryDates,
  getModuleById,
  getModuleIdList,
} from '../controllers/modules_controller';

const router = express.Router();

/**
 * @swagger
 * /modules/ids:
 *   get:
 *     summary: Get list of module IDs
 *     tags:
 *       - Modules
 */
router.route('/ids').get(asyncHandler(getModuleIdList));

/**
 * @swagger
 * /modules:
 *   get:
 *     summary: Get module details by ID
 *     tags:
 *       - Modules
 */
router.route('/').get(asyncHandler(getModuleById));

/**
 * @swagger
 * /modules:
 *   get:
 *     summary: Get module details by ID
 *     tags:
 *       - Modules
 */
router.route('/diaryDates').get(asyncHandler(getDiaryDates));

// Uncomment and add Swagger documentation for future routes:

// /**
//  * @swagger
//  * /modules:
//  *   post:
//  *     summary: Create a new module
//  *     tags:
//  *       - Modules
//  */
// router.route('/').post(asyncHandler(ModulesController.create));

// /**
//  * @swagger
//  * /modules/{id}:
//  *   get:
//  *     summary: Get a single module by ID
//  *     tags:
//  *       - Modules
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         required: true
//  *         schema:
//  *           type: string
//  */
// router.route('/:id').get(asyncHandler(ModulesController.getById));

// /**
//  * @swagger
//  * /modules/{id}:
//  *   put:
//  *     summary: Update a module by ID
//  *     tags:
//  *       - Modules
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         required: true
//  *         schema:
//  *           type: string
//  */
// router.route('/:id').put(asyncHandler(ModulesController.update));

// /**
//  * @swagger
//  * /modules/updateModuleWithChaptersAndExercise/{id}:
//  *   put:
//  *     summary: Update a module, its chapters, and exercises by ID
//  *     tags:
//  *       - Modules
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         required: true
//  *         schema:
//  *           type: string
//  */
// router.route('/updateModuleWithChaptersAndExercise/:id').put(asyncHandler(ModulesController.updateModuleWithChapterAndExercise));

// /**
//  * @swagger
//  * /modules/{id}:
//  *   delete:
//  *     summary: Delete a module by ID
//  *     tags:
//  *       - Modules
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         required: true
//  *         schema:
//  *           type: string
//  */
// router.route('/:id').delete(ModulesController.delete);

export default router;
