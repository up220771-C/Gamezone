// src/routes/juegos.ts
import { Router } from 'express';
import {
  crearJuego,
  obtenerJuegos,
  obtenerJuegosEnOferta,
  obtenerJuegoPorId,
  actualizarJuego,
  eliminarJuego,
  obtenerMasVendidos,
} from '../controllers/juegosController';

import { verificarToken } from '../middleware/authMiddleware';
import upload from '../middleware/upload'; // ⬅️ middleware para subir archivos

const router = Router();

// Rutas públicas
router.get('/deals', obtenerJuegosEnOferta);
router.get('/', obtenerJuegos);
// Endpoint para juegos más vendidos (ventas >5)
router.get('/masvendidos', obtenerMasVendidos);
// Detalle de juego por ID (colocar al final)
router.get('/:id', obtenerJuegoPorId);
// Endpoint para juegos más vendidos (ventas >5)
router.get('/masvendidos', obtenerMasVendidos);

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
