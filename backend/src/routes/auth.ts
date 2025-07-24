import { Router } from 'express';
import { registrarUsuario, iniciarSesion } from '../controllers/authController';
import { verificarToken } from '../middleware/authMiddleware';
import User from '../models/usuario';

const router = Router();

// Registro de usuario
router.post('/registro', registrarUsuario);

// Login de usuario
router.post('/login', iniciarSesion);

// Obtener perfil de usuario autenticado
router.get('/perfil', verificarToken, async (req, res) => {
  try {
    const usuario = await User.findById((req as any).usuarioId).select('-contraseña');
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ usuario });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el perfil' });
  }
});

// Actualizar perfil (edición de campos)
router.patch('/perfil', verificarToken, async (req, res) => {
  try {
    const updates = req.body; // { nombre?: string, apellido?: string, username?: string, correo?: string }
    const usuario = await User.findByIdAndUpdate(
      (req as any).usuarioId,
      updates,
      { new: true, select: '-contraseña' }
    );
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
});

export default router;
