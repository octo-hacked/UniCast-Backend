// src/api/routes/auth.routes.js
import { authOptions } from '../../config/authOptions.js';
import { Router } from 'express';
import { ExpressAuth } from '@auth/express';
import Google from '@auth/express/providers/google';
import GitHub from '@auth/express/providers/github';
import { config } from '../../config/env.js'; // Make sure this path is correct


const router = Router();

// The fix is to change '/*' to just '/'
// This mounts the Auth.js handler at the root of the path it receives (/api/auth)
router.use(
  '/',
  ExpressAuth(authOptions)
);

export default router;