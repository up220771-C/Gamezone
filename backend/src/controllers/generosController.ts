import { Request, Response } from 'express';
import Genero from '../models/genero';

export const obtenerGeneros = async (_req: Request, res: Response) => {
  try {
    const generos = await Genero.find();
    res.json(generos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener géneros', error });
  }
};
