import { Router } from 'express';
import { authMiddleware, optionalAuth } from '../middlewares/auth.middleware';
import { list, getById, create, update, remove, toggleLike, toggleDislike } from '../controllers/noticia.controller';

const router = Router();

router.get('/list', optionalAuth, list);
router.get('/:id', getById);
router.post('/create', authMiddleware, create);
router.patch('/:id', authMiddleware, update);
router.delete('/:id', authMiddleware, remove);
router.post('/:id/like', authMiddleware, toggleLike);
router.post('/:id/dislike', authMiddleware, toggleDislike);

export { router as noticiaRouter };
