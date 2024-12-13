// userProgress.routes.ts

import express from 'express';

import { asyncHandler } from '../utils/utils';
import UserProgressController from '../controllers/userProgress';
import { isAuthenticated } from '../middlewares/auth';

const router = express.Router();

// Create or update module progress
router
  .route('/module-progress')
  .post(isAuthenticated, asyncHandler(UserProgressController.createOrUpdateModuleProgress));

// Get module progress for a user
router
  .route('/module-progress')
  .get(isAuthenticated, asyncHandler(UserProgressController.getModuleProgress));

// Create or update chapter progress
router
  .route('/chapter-progress')
  .post(isAuthenticated, asyncHandler(UserProgressController.createOrUpdateChapterProgress));

// Get chapter progress for a module
router
  .route('/chapter-progress/:moduleProgressId')
  .get(isAuthenticated, asyncHandler(UserProgressController.getChapterProgress));

export default router;
