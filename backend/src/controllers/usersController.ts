// src/controllers/usersController.ts
import { Request, Response } from 'express';
import User from '../models/usuario';

export const crearUsuario = async (req: Request, res: Response) => {
  try {
    const { nombre, apellido, username, correo, contraseña, rol } = req.body;

    // 1) Verificar duplicados
    const existe = await User.findOne({ $or: [{ username }, { correo }] });
    if (existe) {
      return res.status(400).json({ mensaje: 'Username o correo ya en uso' });
    }

    // 2) Crear documento
    const user = new User({ nombre, apellido, username, correo, contraseña, rol });
    await user.save();

    // 3) Responder sin exponer la contraseña
    const { _id } = user;
    res.status(201).json({ 
      mensaje: 'Usuario creado', 
      user: { _id, nombre, apellido, username, correo, rol } 
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ mensaje: 'Error al crear usuario' });
  }
};

export const obtenerUsuarios = async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select('-contraseña');
    res.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ mensaje: 'Error al obtener usuarios' });
  }
};

export const obtenerUsuarioPorId = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-contraseña');
    if (!user) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    console.error('Error al buscar usuario:', error);
    res.status(500).json({ mensaje: 'Error al buscar usuario' });
  }
};

export const actualizarUsuario = async (req: Request, res: Response) => {
  try {
    const updates: Partial<{
      nombre: string;
      apellido: string;
      username: string;
      correo: string;
      contraseña: string;
      rol: 'cliente' | 'admin';
    }> = { ...req.body };

    // Si vienen cambios de contraseña, aquí podrías hashearla antes
    // Por simplicidad usamos findByIdAndUpdate:
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).select('-contraseña');

    if (!user) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json({ mensaje: 'Usuario actualizado', user });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ mensaje: 'Error al actualizar usuario' });
  }
};

export const eliminarUsuario = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ mensaje: 'Error al eliminar usuario' });
  }
};
