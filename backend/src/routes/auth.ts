import { Router } from 'express';
import { registrarUsuario, iniciarSesion } from '../controllers/authController';
import { verificarToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/registro', registrarUsuario);
router.post('/login',    iniciarSesion);
router.get('/perfil', verificarToken, (req, res) => {
  res.json({ mensaje: 'Ruta protegida', usuarioId: (req as any).usuarioId });
});

export default router;
