import { Request, Response } from 'express';
import Juego from '../models/juegos';  // tu modelo de juegos principal

/**
 * Crea un nuevo juego
 */
export const crearJuego = async (req: Request, res: Response) => {
  try {
    const {
      nombre,
      descripcion,
      precio,
      plataforma,
      genero,
      imagen,
      disponible = true
    } = req.body;

    if (!nombre || !descripcion) {
      return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }

    const juego = new Juego({
      nombre,
      descripcion,
      precio,
      plataforma,
      genero,
      imagen,
      disponible
    });

    await juego.save();
    res.status(201).json({ mensaje: 'Juego creado', juego });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear el juego.' });
  }
};

/**
 * Actualiza un juego existente (por ID)
 */
export const actualizarJuego = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const juego = await Juego.findByIdAndUpdate(id, updates, { new: true });
    if (!juego) {
      return res.status(404).json({ error: 'Juego no encontrado.' });
    }

    res.json({ mensaje: 'Juego actualizado', juego });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar el juego.' });
  }
};

/**
 * Borra un juego (por ID)
 */
export const borrarJuego = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const juego = await Juego.findByIdAndDelete(id);
    if (!juego) {
      return res.status(404).json({ error: 'Juego no encontrado.' });
    }
    res.json({ mensaje: 'Juego eliminado' });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar el juego.' });
  }
};
