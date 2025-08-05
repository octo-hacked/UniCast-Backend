import { Router } from 'express';
import authRoutes from './auth.routes.js';
import { signUpHandler } from '../controllers/sign-up.js';

const router = Router();

router.use('/auth', authRoutes);
router.post('/signup', signUpHandler);
router.get('/', (req, res) => {
  res.send('Welcome to the API');
});


// router.use('/posts', postRoutes);

export default router;