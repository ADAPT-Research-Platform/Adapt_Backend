import express from 'express';
import 'express-async-errors';

import authRoutes from './auth';
import usersRoutes from './users';
import modulesRoutes from './modules';
import commentsRoutes from './comments';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/modules', modulesRoutes);
router.use('/comments', commentsRoutes);

router.route('/health').get((req, res) => res.send('Server is up!'));

export default router;