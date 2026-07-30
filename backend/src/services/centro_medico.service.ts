import { CentroMedicoRepository } from '../repositories/centro_medico.repository';
import { getPaginationParams, paginatedResponse } from '../utils/pagination.util';
import type { CreateCentroMedicoDTO, UpdateCentroMedicoDTO, CentroMedicoResponse } from '../models/schemas.dto';
import type { PaginatedResponse, PaginationParams } from '../utils/pagination.util';

export class CentroMedicoService {
  private repo = new CentroMedicoRepository();

  async list(query: PaginationParams): Promise<PaginatedResponse<CentroMedicoResponse>> {
    const { page, limit, offset } = getPaginationParams(query);
    const [data, total] = await Promise.all([
      this.repo.findAll(limit, offset),
      this.repo.countAll(),
    ]);
    return paginatedResponse(data, total, page, limit);
  }

  async getById(id: number): Promise<CentroMedicoResponse> {
    const [found] = await this.repo.findById(id);
    if (!found) throw new Error('Centro médico no encontrado');
    return found as CentroMedicoResponse;
  }

  async create(data: CreateCentroMedicoDTO): Promise<CentroMedicoResponse> {
    const payload: CreateCentroMedicoDTO = {};
    if (data.nombre !== undefined) payload.nombre = data.nombre;
    if (data.correo !== undefined) payload.correo = data.correo;
    if (data.ubicacion !== undefined) payload.ubicacion = data.ubicacion;
    if (data.rif !== undefined) payload.rif = data.rif;
    if (data.telefono !== undefined) payload.telefono = data.telefono;
    const [created] = await this.repo.create(payload);
    return created as CentroMedicoResponse;
  }

  async update(id: number, data: UpdateCentroMedicoDTO): Promise<CentroMedicoResponse> {
    await this.getById(id);
    const payload: UpdateCentroMedicoDTO = {};
    if (data.nombre !== undefined) payload.nombre = data.nombre;
    if (data.correo !== undefined) payload.correo = data.correo;
    if (data.ubicacion !== undefined) payload.ubicacion = data.ubicacion;
    if (data.rif !== undefined) payload.rif = data.rif;
    if (data.telefono !== undefined) payload.telefono = data.telefono;
    const [updated] = await this.repo.update(id, payload);
    return updated as CentroMedicoResponse;
  }

  async remove(id: number): Promise<void> {
    await this.getById(id);
    await this.repo.deleteJornadasByCentroMedicoId(id);
    await this.repo.nullifyRepresentantesCentroMedico(id);
    await this.repo.delete(id);
  }
}
