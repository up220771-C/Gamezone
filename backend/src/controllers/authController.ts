import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt     from 'jsonwebtoken';
import User         from '../models/usuario';

export const registrarUsuario = async (req: Request, res: Response) => {
  try {
    const { nombre, apellido, username, correo, contraseña } = req.body;

    if (!nombre || !apellido || !username || !correo || !contraseña) {
      return res.status(400).json({ error: 'Faltan datos obligatorios.' });
    }

    // 2) Comprobar duplicados
    const correoExistente  = await User.findOne({ correo });
    const userExistente    = await User.findOne({ username });
    if (correoExistente) return res.status(409).json({ error: 'Correo ya registrado.' });
    if (userExistente)   return res.status(409).json({ error: 'Username en uso.' });

    // 3) Hashear contraseña
    const hash = await bcrypt.hash(contraseña, 10);

    // 4) Crear y guardar usuario
    const nuevoUsuario = new User({
      nombre,
      apellido,
      username,
      correo,
      contraseña: hash,
      rol: 'cliente'
    });
    await nuevoUsuario.save();

    // 5) Responder éxito
    res.status(201).json({ mensaje: 'Usuario registrado correctamente.' });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

export const iniciarSesion = async (req: Request, res: Response) => {
  try {
    const { correo, contraseña } = req.body;
    const usuario = await User.findOne({ correo });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado.' });

    const valido = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!valido) return res.status(401).json({ error: 'Credenciales inválidas.' });

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    res.json({
    mensaje: 'Login exitoso.',
    token,
    usuario: {
      username: usuario.username,
      rol: usuario.rol
    }
  });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};
