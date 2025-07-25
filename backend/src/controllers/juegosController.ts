// src/controllers/juegosController.ts
import { Request, Response } from 'express';
import Juego from '../models/juegos';

export const crearJuego = async (req: Request, res: Response) => {
  try {
    const nuevoJuego = new Juego(req.body);
    await nuevoJuego.save();
    res.status(201).json(nuevoJuego);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear el juego', error });
  }
};

export const obtenerJuegos = async (req: Request, res: Response) => {
  try {
    // Si llega un query ?plataforma=..., filtramos por ese campo.
    const filtro: any = {};
    if (req.query.plataforma) {
      filtro.plataforma = req.query.plataforma;
    }
    const juegos = await Juego.find(filtro);
    res.json(juegos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los juegos', error });
  }
};

export const obtenerJuegoPorId = async (req: Request, res: Response) => {
  try {
    const juego = await Juego.findById(req.params.id);
    if (!juego) return res.status(404).json({ mensaje: 'Juego no encontrado' });
    res.json(juego);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar el juego', error });
  }
};

export const actualizarJuego = async (req: Request, res: Response) => {
  try {
    const juego = await Juego.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!juego) return res.status(404).json({ mensaje: 'Juego no encontrado' });
    res.json(juego);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el juego', error });
  }
};

export const eliminarJuego = async (req: Request, res: Response) => {
  try {
    const juego = await Juego.findByIdAndDelete(req.params.id);
    if (!juego) return res.status(404).json({ mensaje: 'Juego no encontrado' });
    res.json({ mensaje: 'Juego eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el juego', error });
  }
};
