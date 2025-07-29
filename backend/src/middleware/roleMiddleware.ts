import { Request, Response, NextFunction } from 'express';

export const checkRole = (roles: Array<'admin'|'cliente'>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const rol = (req as any).usuarioRol as string;
    if (!rol || !roles.includes(rol as any)) {
      return res.status(403).json({ mensaje: 'Acceso no autorizado' });
    }
    next();
  }
};
