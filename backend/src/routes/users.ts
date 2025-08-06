// src/routes/users.ts
import { Router } from 'express';
import {
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
} from '../controllers/usersController';
import { verificarToken } from '../middleware/authMiddleware'; // tu middleware JWT

const router = Router();

// Rutas públicas
router.post('/', crearUsuario);
router.get('/', obtenerUsuarios);
router.get('/:id', obtenerUsuarioPorId);

// Rutas protegidas (ej. sólo admin puede modificar o borrar)
router.use(verificarToken);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);

export default router;
