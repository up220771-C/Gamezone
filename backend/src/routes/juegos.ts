// src/routes/juegos.ts
import { Router } from 'express';
import {
  crearJuego,
  obtenerJuegos,
  obtenerJuegosEnOferta,
  obtenerJuegoPorId,
  actualizarJuego,
  eliminarJuego,
} from '../controllers/juegosController';
import { verificarToken } from '../middleware/authMiddleware';

const router = Router();

// Rutas de ofertas y detalle
router.get('/deals', obtenerJuegosEnOferta);
router.get('/',       obtenerJuegos);
router.get('/:id',    obtenerJuegoPorId);

// Rutas protegidas
router.post('/',       verificarToken, crearJuego);
router.put('/:id',     verificarToken, actualizarJuego);
router.delete('/:id',  verificarToken, eliminarJuego);

export default router;
