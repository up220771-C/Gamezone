import { Router } from 'express';
import {
  crearJuego,
  obtenerJuegos,
  obtenerJuegoPorId,
  actualizarJuego,
  eliminarJuego
} from '../controllers/juegosController';
import { verificarToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', obtenerJuegos);
router.get('/:id', obtenerJuegoPorId);
router.post('/', verificarToken, crearJuego);
router.put('/:id', verificarToken, actualizarJuego);
router.delete('/:id', verificarToken, eliminarJuego);

export default router;
