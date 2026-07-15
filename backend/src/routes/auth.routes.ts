import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateLogin, validateRegister } from '../validators/auth.validator';
import { register, login, getProfile } from '../controllers/auth.controller';

const router = Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/profile', authMiddleware, getProfile);

export { router as authRouter };
