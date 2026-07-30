import { JornadaRepository } from '../repositories/medic.repository';
import { getPaginationParams, paginatedResponse } from '../utils/pagination.util';
import type { CreateJornadaDTO, UpdateJornadaDTO, JornadaResponse } from '../models/schemas.dto';
import type { PaginatedResponse, PaginationParams } from '../utils/pagination.util';

export class JornadaService {
  private repo = new JornadaRepository();

  async list(query: PaginationParams): Promise<PaginatedResponse<JornadaResponse>> {
    const { page, limit, offset } = getPaginationParams(query);
    const [data, total] = await Promise.all([
      this.repo.findAll(limit, offset),
      this.repo.countAll(),
    ]);
    return paginatedResponse(data, total, page, limit);
  }

  async getById(id: number): Promise<JornadaResponse> {
    const [found] = await this.repo.findById(id);
    if (!found) throw new Error('Jornada no encontrada');
    return found as JornadaResponse;
  }

  async create(data: CreateJornadaDTO): Promise<JornadaResponse> {
    const [created] = await this.repo.create(data);
    return created as JornadaResponse;
  }

  async update(id: number, data: UpdateJornadaDTO): Promise<JornadaResponse> {
    await this.getById(id);
    const [updated] = await this.repo.update(id, data);
    return updated as JornadaResponse;
  }

  async remove(id: number): Promise<void> {
    await this.getById(id);
    await this.repo.delete(id);
  }
}
