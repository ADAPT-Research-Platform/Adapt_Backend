import express from 'express';
import 'express-async-errors';

import authRoutes from './auth';
import usersRoutes from './users';
import modulesRoutes from './modules';
import commentsRoutes from './comments';
import answersRoutes from './answers';
import moodRoutes from './mood';
import adminRoutes from './admin';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/modules', modulesRoutes);
router.use('/comments', commentsRoutes);
router.use('/answers', answersRoutes);
router.use('/moods', moodRoutes);
router.use('/admin', adminRoutes);

router.route('/health').get((req, res) => res.send('Server is up!'));

export default router;