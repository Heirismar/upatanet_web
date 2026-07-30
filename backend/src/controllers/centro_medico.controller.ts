import { Request, Response } from 'express';
import { CentroMedicoService } from '../services/centro_medico.service';

const centroMedicoService = new CentroMedicoService();

export async function list(req: Request, res: Response) {
  const result = await centroMedicoService.list(req.query);
  res.json(result);
}

export async function getById(req: Request, res: Response) {
  const id = Number(req.params.id);
  const result = await centroMedicoService.getById(id);
  res.json(result);
}

export async function create(req: Request, res: Response) {
  const result = await centroMedicoService.create(req.body);
  res.status(201).json(result);
}

export async function update(req: Request, res: Response) {
  const id = Number(req.params.id);
  const result = await centroMedicoService.update(id, req.body);
  res.json(result);
}

export async function remove(req: Request, res: Response) {
  const id = Number(req.params.id);
  await centroMedicoService.remove(id);
  res.status(204).end();
}
