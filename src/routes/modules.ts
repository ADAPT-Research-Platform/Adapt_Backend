// modules.routes.ts

import express from 'express';

import { asyncHandler } from '../utils/utils';

import {
  getModuleById,
  getModuleIdList,
} from '../controllers/modules';

const router = express.Router();

// Create a module
//router.route('/').post(asyncHandler( ModulesController.create));

// Get modules id list
router.route('/ids').get(asyncHandler(getModuleIdList));

// Get module by id
router.route('/').get(asyncHandler(getModuleById));

// Get a single module by ID
//router.route('/:id').get(asyncHandler(ModulesController.getById));

// Update a module by ID
//router.route('/:id').put(asyncHandler(ModulesController.update));

// Update a module and it's chapter and exercise by ID
//router.route('/updateModuleWithChaptersAndExercise/:id').put(asyncHandler(ModulesController.updateModuleWithChapterAndExercise));

// Delete a module by ID
//router.route('/:id').delete(ModulesController.delete);

export default router;
