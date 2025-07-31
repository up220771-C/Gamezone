import { Request, Response } from 'express';
import Juego from '../models/juegos';

// Crear juego con imagen de archivo
export const crearJuego = async (req: Request, res: Response) => {
  try {
    // 🔍 Logs para diagnóstico
    console.log('📦 Body recibido:', req.body);
    console.log('🖼 Ruta absoluta del archivo:', req.file?.path);
    console.log('🖼 Nombre de archivo:', req.file?.filename);

    const { nombre, descripcion, precio, plataforma, genero, stock } = req.body;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ mensaje: 'Imagen no proporcionada.' });
    }

    // Construyo la URL pública completa de la imagen
    const protocol = req.protocol;
    const host = req.get('host'); // ej. "localhost:5000"
    const imagenUrl = `${protocol}://${host}/uploads/${file.filename}`;

    const nuevoJuego = new Juego({
      nombre,
      descripcion,
      precio: parseFloat(precio),
      plataforma,
      genero,
      stock: parseInt(stock, 10),
      imagen: imagenUrl
    });

    await nuevoJuego.save();
    return res.status(201).json(nuevoJuego);
  } catch (error) {
    console.error('💥 Error al crear juego:', error);
    return res.status(500).json({ mensaje: 'Error al crear el juego', error });
  }
};




export const obtenerJuegos = async (req: Request, res: Response) => {
  try {
    const filtro: any = {};
    if (req.query.plataforma) filtro.plataforma = req.query.plataforma;
    const juegos = await Juego.find(filtro);
    res.json(juegos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los juegos', error });
  }
};

export const obtenerJuegosEnOferta = async (_: Request, res: Response) => {
  try {
    const ofertas = await Juego.find({ descuento: { $gt: 0 } });
    res.json(ofertas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener ofertas', error });
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
