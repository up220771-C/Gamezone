import { Request, Response } from 'express';
import Compra from '../models/compras';
import Juego from '../models/juegos';

export const crearCompra = async (req: Request, res: Response) => {
  try {
    const { juego } = req.body; // juego = ID del juego
    const usuarioId = (req as any).usuarioId;

    // Buscar el juego
    const juegoEncontrado = await Juego.findById(juego);

    if (!juegoEncontrado) {
      return res.status(404).json({ mensaje: 'Juego no encontrado' });
    }

    // Verificar stock
    if (juegoEncontrado.stock <= 0) {
      return res.status(400).json({ mensaje: 'Stock agotado para este juego' });
    }

    // Restar stock
    juegoEncontrado.stock -= 1;

    // Marcar como no disponible si el stock llega a 0
    if (juegoEncontrado.stock === 0) {
      juegoEncontrado.disponible = false;
    }

    await juegoEncontrado.save();

    // Crear la compra
    const nuevaCompra = new Compra({
      juego,
      usuario: usuarioId,
      fecha: new Date(),
      precioPagado: juegoEncontrado.precio - (juegoEncontrado.precio * juegoEncontrado.descuento) / 100
    });

    await nuevaCompra.save();

    res.status(201).json({
      mensaje: 'Compra realizada con éxito',
      compra: nuevaCompra,
      stockRestante: juegoEncontrado.stock
    });
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
