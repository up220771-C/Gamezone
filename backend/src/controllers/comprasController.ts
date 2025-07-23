import { Request, Response } from 'express';
import Compra from '../models/compras';

export const crearCompra = async (req: Request, res: Response) => {
  try {
    const { juego } = req.body;
    const usuarioId = (req as any).usuarioId;

    const nuevaCompra = new Compra({ juego, usuario: usuarioId });
    await nuevaCompra.save();

    res.status(201).json(nuevaCompra);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar la compra', error });
  }
};

export const obtenerComprasDelUsuario = async (req: Request, res: Response) => {
  try {
    const usuarioId = (req as any).usuarioId;
    const compras = await Compra.find({ usuario: usuarioId }).populate('juego');
    res.json(compras);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener compras', error });
  }
};
