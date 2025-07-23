import { Router } from 'express';
import { obtenerGeneros } from '../controllers/generosController';

const router = Router();
router.get('/', obtenerGeneros);
export default router;
