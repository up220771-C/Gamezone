import { Request, Response } from 'express';
import Plataforma from '../models/plataforma';

export const obtenerPlataformas = async (_req: Request, res: Response) => {
  try {
    const plataformas = await Plataforma.find();
    res.json(plataformas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener plataformas', error });
  }
};
