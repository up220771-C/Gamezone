import { Router } from 'express';
import { verificarToken } from '../middleware/authMiddleware';
import { checkRole } from '../middleware/roleMiddleware';
import {
  crearJuego,
  actualizarJuego,
  borrarJuego
} from '../controllers/adminController';

const router = Router();

// Todas las rutas en /api/admin/* requieren token válido y rol 'admin'
router.use(verificarToken, checkRole(['admin']));

router.post('/juegos',        crearJuego);
router.patch('/juegos/:id',   actualizarJuego);
router.delete('/juegos/:id',  borrarJuego);

export default router;
