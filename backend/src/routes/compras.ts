import { Router } from 'express';
import { crearCompra, obtenerComprasDelUsuario } from '../controllers/comprasController';
import { verificarToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/', verificarToken, crearCompra);
router.get('/', verificarToken, obtenerComprasDelUsuario);

export default router;
