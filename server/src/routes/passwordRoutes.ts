import { Router } from 'express';

import {
  resetPassword,
  requestPasswordReset,
} from '../controllers/passwordController';

const router = Router();

router.post('/reset-password', resetPassword);
router.post('/forgot-password', requestPasswordReset);

export default router;
