import { Router } from 'express';
import { obtenerPlataformas } from '../controllers/plataformasController';

const router = Router();
router.get('/', obtenerPlataformas);
export default router;
