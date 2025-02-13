import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { validateUpdateUser } from '../validators/user.validator';
import {
  getProfile,
  updateProfile,
  deleteProfile
} from '../controllers/user.controller';

const router = Router();

router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, validateUpdateUser, updateProfile);
router.delete('/profile', authenticateToken, deleteProfile);

export default router;