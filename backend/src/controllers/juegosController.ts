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
    const { id } = req.params;
    // Extraemos cada campo del formulario
    const {
      nombre,
      descripcion,
      precio,
      plataforma,
      genero,
      stock
    } = req.body;

    // Construimos el objeto de actualización
    const updateData: any = {
      nombre,
      descripcion,
      precio: parseFloat(precio),
      plataforma,
      genero,
      stock: parseInt(stock, 10),
    };

    // Si Multer detectó nueva imagen, actualizamos la URL pública
    if (req.file) {
      const protocol = req.protocol;
      const host = req.get('host');
      updateData.imagen = `${protocol}://${host}/uploads/${req.file.filename}`;
    }

    // findByIdAndUpdate con { new: true } devuelve el documento ya modificado
    const juegoActualizado = await Juego.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!juegoActualizado) {
      return res.status(404).json({ mensaje: 'Juego no encontrado' });
    }

    return res.json(juegoActualizado);
  } catch (error) {
    console.error('💥 Error al actualizar juego:', error);
    return res.status(500).json({ mensaje: 'Error al actualizar el juego', error });
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
// Obtener juegos más vendidos (ventas > 5)
import Compra from '../models/compras';
export const obtenerMasVendidos = async (_: Request, res: Response) => {
  try {
    // Agrupar compras por juego y contar ventas
    const top = await Compra.aggregate([
      { $group: { _id: '$juego', count: { $sum: 1 } } },
      { $match: { count: { $gt: 5 } } },
      { $sort: { count: -1 } }
    ]);
    const gameIds = top.map((item: any) => item._id);
    // Obtener detalles de juegos
    const juegos = await Juego.find({ _id: { $in: gameIds } });
    // Combinar datos
    const result = juegos.map(j => {
      const stats = top.find((t: any) => t._id.equals(j._id));
      return { juego: j, ventas: stats ? stats.count : 0 };
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener juegos más vendidos', error });
  }
};
