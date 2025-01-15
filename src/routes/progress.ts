import express from 'express';

import { createUpdateProgress } from '../controllers/modules';

const router = express.Router();

// Add/Update (root or reply)
router.post('/', createUpdateProgress);

export default router;
