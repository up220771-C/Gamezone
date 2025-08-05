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
import upload from '../middleware/upload'; // ⬅️ middleware para subir archivos

const router = Router();

// Rutas públicas
router.get('/deals', obtenerJuegosEnOferta);
router.get('/', obtenerJuegos);
router.get('/:id', obtenerJuegoPorId);

// Rutas protegidas
router.post('/', verificarToken, upload.single('imagen'), crearJuego); // ⬅️ ajustado
router.put(
  '/:id',
  verificarToken,
  upload.single('imagen'),      // <-- aquí usamos Multer
  actualizarJuego
);
router.delete('/:id', verificarToken, eliminarJuego);

// ✂ src/routes/juegos.ts
router.delete('/:id',
  verificarToken,
  eliminarJuego
);

export default router;
