import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateLogin, validateRegister } from '../validators/auth.validator';
import { register, login, getProfile, updateCentroMedico } from '../controllers/auth.controller';

const router = Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/profile', authMiddleware, getProfile);
router.patch('/representante/centro-medico', authMiddleware, updateCentroMedico);

export { router as authRouter };
