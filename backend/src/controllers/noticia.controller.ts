import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { NoticiaService } from '../services/noticia.service';

const noticiaService = new NoticiaService();

export async function list(req: Request, res: Response) {
  const usuarioId = (req as AuthRequest).usuarioId;
  const result = await noticiaService.list({ ...req.query, usuarioId });
  res.json(result);
}

export async function getById(req: Request, res: Response) {
  const id = Number(req.params.id);
  const result = await noticiaService.getById(id);
  res.json(result);
}

export async function create(req: Request, res: Response) {
  const result = await noticiaService.create(req.body);
  res.status(201).json(result);
}

export async function update(req: Request, res: Response) {
  const id = Number(req.params.id);
  const result = await noticiaService.update(id, req.body);
  res.json(result);
}

export async function remove(req: Request, res: Response) {
  const id = Number(req.params.id);
  await noticiaService.remove(id);
  res.status(204).end();
}

export async function toggleLike(req: Request, res: Response) {
  const usuarioId = (req as AuthRequest).usuarioId!;
  const noticiaId = Number(req.params.id);
  const result = await noticiaService.toggleReaction(usuarioId, noticiaId, 'like');
  res.json(result);
}

export async function toggleDislike(req: Request, res: Response) {
  const usuarioId = (req as AuthRequest).usuarioId!;
  const noticiaId = Number(req.params.id);
  const result = await noticiaService.toggleReaction(usuarioId, noticiaId, 'dislike');
  res.json(result);
}
