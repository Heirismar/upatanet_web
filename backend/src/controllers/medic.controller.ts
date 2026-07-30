import { Request, Response } from 'express';
import { JornadaService } from '../services/medic.services';

const jornadaService = new JornadaService();

export async function list(req: Request, res: Response) {
  const result = await jornadaService.list(req.query);
  res.json(result);
}

export async function getById(req: Request, res: Response) {
  const id = Number(req.params.id);
  const result = await jornadaService.getById(id);
  res.json(result);
}

export async function create(req: Request, res: Response) {
  const result = await jornadaService.create(req.body);
  res.status(201).json(result);
}

export async function update(req: Request, res: Response) {
  const id = Number(req.params.id);
  const result = await jornadaService.update(id, req.body);
  res.json(result);
}

export async function remove(req: Request, res: Response) {
  const id = Number(req.params.id);
  await jornadaService.remove(id);
  res.status(204).end();
}
