import { Router } from 'express';
import { obtenerGeneros } from '../controllers/generosController';
import { verificarToken } from '../middleware/authMiddleware';

const router = Router();
router.use(verificarToken);
router.get('/', obtenerGeneros);
export default router;
