import { Router } from 'express';
import authRoutes from './auth.routes.js';
import { signUpHandler } from '../controllers/sign-up.js';
import { authenticateToken, optionalAuth } from '../../api/middleware/auth.middleware.js';

const router = Router();

router.use('/auth', authRoutes);
router.post('/signup', signUpHandler);

// Public route
router.get('/', (req, res) => {
  res.send('Welcome to the API');
});

// Protected route example
router.get('/profile', authenticateToken, (req, res) => {
  res.json({
    message: 'Protected route accessed successfully',
    user: req.user
  });
});

// Route with optional authentication
router.get('/posts', optionalAuth, (req, res) => {
  res.json({
    message: 'Posts retrieved',
    user: req.user || null // Will be null if not authenticated
  });
});

export default router;