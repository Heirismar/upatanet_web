import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../middlewares/auth.middleware';

const authService = new AuthService();

export async function register(req: Request, res: Response) {
  const result = await authService.register(req.body);
  res.status(201).json(result);
}

export async function login(req: Request, res: Response) {
  const result = await authService.login(req.body);
  res.json(result);
}

export async function getProfile(req: Request, res: Response) {
  const usuarioId = (req as AuthRequest).usuarioId!;
  const user = await authService.getProfile(usuarioId);
  res.json(user);
}

export async function updateCentroMedico(req: Request, res: Response) {
  const usuarioId = (req as AuthRequest).usuarioId!;
  const { centro_medico_id } = req.body;
  const result = await authService.updateCentroMedico(usuarioId, centro_medico_id);
  res.json(result);
}
