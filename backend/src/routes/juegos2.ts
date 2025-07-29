// src/routes/juegos2.ts
import { Router, Request, Response } from 'express';
import Juego2 from '../models/juegos2';   // tu modelo apuntando a la colección "juegos_2"
import { verificarToken } from '../middleware/authMiddleware';

const router = Router();
router.use(verificarToken);
// GET /api/juegos_2
router.get('/', async (_req: Request, res: Response) => {
  try {
    const lista2 = await Juego2.find();
    res.json(lista2);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
