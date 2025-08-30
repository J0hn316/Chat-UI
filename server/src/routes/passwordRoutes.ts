import { Router } from 'express';

import {
  requestPasswordReset,
  restPassword,
} from '../controllers/passwordController';

const router = Router();

router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', restPassword);

export default router;
