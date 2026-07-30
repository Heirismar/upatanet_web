import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { list, getById, create, update, remove } from '../controllers/usuario.controller';

const router = Router();

router.get('/list', list);
router.get('/:id', getById);
router.post('/create', authMiddleware, create);
router.patch('/:id', authMiddleware, update);
router.delete('/:id', authMiddleware, remove);

export { router as usuarioRouter };
