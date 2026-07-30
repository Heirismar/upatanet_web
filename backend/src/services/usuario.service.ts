import { UsuarioRepository } from '../repositories/usuario.repository';
import { getPaginationParams, paginatedResponse } from '../utils/pagination.util';
import type { CreateUsuarioDTO, UpdateUsuarioDTO, UsuarioResponse } from '../models/schemas.dto';
import type { PaginatedResponse, PaginationParams } from '../utils/pagination.util';

export class UsuarioService {
  private repo = new UsuarioRepository();

  async list(query: PaginationParams): Promise<PaginatedResponse<UsuarioResponse>> {
    const { page, limit, offset } = getPaginationParams(query);
    const [data, total] = await Promise.all([
      this.repo.findAll(limit, offset),
      this.repo.countAll(),
    ]);
    return paginatedResponse(data, total, page, limit);
  }

  async getById(id: number): Promise<UsuarioResponse> {
    const [found] = await this.repo.findById(id);
    if (!found) throw new Error('Usuario no encontrado');
    const result = { ...found } as UsuarioResponse;
    if (found.rol === 'admin') {
      const [adminData] = await this.repo.findAdminByUsuarioId(id);
      if (adminData) {
        result.correo = adminData.correo;
        result.telefono = adminData.telefono;
        result.cedula = adminData.cedula;
      }
    } else if (found.rol === 'representante') {
      const [rep] = await this.repo.findRepresentanteByUsuarioId(id);
      if (rep) {
        result.correo = rep.correo;
        result.c_i = rep.c_i;
        result.centro_medico_id = rep.centro_medico_id;
      }
    }
    return result;
  }

  async create(data: CreateUsuarioDTO): Promise<UsuarioResponse> {
    const { correo, telefono, cedula, c_i, centro_medico_id, ...usuarioData } = data;
    const [created] = await this.repo.create(usuarioData);
    if (data.rol === 'admin') {
      const bcrypt = await import('bcryptjs');
      const hash = await bcrypt.hash('123456', 12);
      await this.repo.createAdmin({
        usuario_id: created.id,
        correo,
        telefono,
        cedula,
        contrasena: hash,
      });
    } else if (data.rol === 'representante') {
      const bcrypt = await import('bcryptjs');
      const hash = await bcrypt.hash('123456', 12);
      await this.repo.createRepresentante({
        usuario_id: created.id,
        correo,
        c_i,
        centro_medico_id,
        contrasena: hash,
      });
    }
    return this.getById(created.id);
  }

  async update(id: number, data: UpdateUsuarioDTO): Promise<UsuarioResponse> {
    const existing = await this.getById(id);
    const { correo, telefono, cedula, c_i, centro_medico_id, ...usuarioData } = data;
    if (Object.keys(usuarioData).length > 0) {
      await this.repo.update(id, usuarioData);
    }
    const rol = data.rol || existing.rol;
    if (rol === 'admin' && (correo !== undefined || telefono !== undefined || cedula !== undefined)) {
      const extra: Record<string, unknown> = {};
      if (correo !== undefined) extra.correo = correo;
      if (telefono !== undefined) extra.telefono = telefono;
      if (cedula !== undefined) extra.cedula = cedula;
      await this.repo.updateAdmin(id, extra);
    } else if (rol === 'representante' && (correo !== undefined || c_i !== undefined || centro_medico_id !== undefined)) {
      const extra: Record<string, unknown> = {};
      if (correo !== undefined) extra.correo = correo;
      if (c_i !== undefined) extra.c_i = c_i;
      if (centro_medico_id !== undefined) extra.centro_medico_id = centro_medico_id;
      await this.repo.updateRepresentante(id, extra);
    }
    return this.getById(id);
  }

  async remove(id: number): Promise<void> {
    await this.getById(id);
    await this.repo.deleteAdminByUsuarioId(id);
    await this.repo.deleteRepresentanteByUsuarioId(id);
    await this.repo.deleteIndigenaByUsuarioId(id);
    await this.repo.deleteNoticiasByUsuarioId(id);
    await this.repo.deleteAlarmasByUsuarioId(id);
    await this.repo.delete(id);
  }
}
