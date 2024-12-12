// modules.routes.ts

import express from 'express';

import ModulesController from '../controllers/modules';

const router = express.Router();

// Create a module
router.route('/').post(ModulesController.create);

// Get all modules
router.route('/').get(ModulesController.getAll);

// Get a single module by ID
router.route('/:id').get(ModulesController.getById);

// Update a module by ID
router.route('/:id').put(ModulesController.update);

// Update a module and it's chapter and exercise by ID
router.route('/updateModuleWithChaptersAndExercise/:id').put(ModulesController.updateModuleWithChapterAndExercise);

// Delete a module by ID
router.route('/:id').delete(ModulesController.delete);

export default router;
