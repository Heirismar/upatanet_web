import { Request, Response } from 'express';
import { UsuarioService } from '../services/usuario.service';

const usuarioService = new UsuarioService();

export async function list(req: Request, res: Response) {
  const result = await usuarioService.list(req.query);
  res.json(result);
}

export async function getById(req: Request, res: Response) {
  const id = Number(req.params.id);
  const result = await usuarioService.getById(id);
  res.json(result);
}

export async function create(req: Request, res: Response) {
  const result = await usuarioService.create(req.body);
  res.status(201).json(result);
}

export async function update(req: Request, res: Response) {
  const id = Number(req.params.id);
  const result = await usuarioService.update(id, req.body);
  res.json(result);
}

export async function remove(req: Request, res: Response) {
  const id = Number(req.params.id);
  await usuarioService.remove(id);
  res.status(204).end();
}
