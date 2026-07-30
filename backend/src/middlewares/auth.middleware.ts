import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { envConfig } from '../config/env.config';

export interface AuthRequest extends Request {
  usuarioId?: number;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Token de autenticación no proporcionado',
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, envConfig.jwt.secret) as { usuarioId: number };

    (req as AuthRequest).usuarioId = decoded.usuarioId;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token de autenticación inválido o expirado',
    });
  }
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, envConfig.jwt.secret) as { usuarioId: number };
      (req as AuthRequest).usuarioId = decoded.usuarioId;
    }
  } catch {}
  next();
};
