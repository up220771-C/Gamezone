import { Router } from 'express';
import { obtenerPlataformas } from '../controllers/plataformasController';
import { verificarToken } from '../middleware/authMiddleware';

const router = Router();
router.use(verificarToken);
router.get('/', obtenerPlataformas);
export default router;
