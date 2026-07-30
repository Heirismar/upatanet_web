import { eq, count } from 'drizzle-orm';
import { db } from '../config/db.config';
import { usuario, admin, representante, indigena, noticia, alarma } from '../database/schemas/schema';
import type { CreateUsuarioDTO, UpdateUsuarioDTO } from '../models/schemas.dto';

export class UsuarioRepository {
  async findAll(limit: number, offset: number) {
    return db.select().from(usuario).limit(limit).offset(offset);
  }

  async findById(id: number) {
    return db.select().from(usuario).where(eq(usuario.id, id)).limit(1);
  }

  async countAll() {
    const [result] = await db.select({ total: count() }).from(usuario);
    return result.total;
  }

  async create(data: CreateUsuarioDTO) {
    return db.insert(usuario).values(data).returning();
  }

  async update(id: number, data: UpdateUsuarioDTO) {
    return db.update(usuario).set(data).where(eq(usuario.id, id)).returning();
  }

  async delete(id: number) {
    await db.delete(usuario).where(eq(usuario.id, id));
  }

  async deleteAdminByUsuarioId(usuarioId: number) {
    await db.delete(admin).where(eq(admin.usuario_id, usuarioId));
  }

  async deleteRepresentanteByUsuarioId(usuarioId: number) {
    await db.delete(representante).where(eq(representante.usuario_id, usuarioId));
  }

  async deleteIndigenaByUsuarioId(usuarioId: number) {
    await db.delete(indigena).where(eq(indigena.usuario_id, usuarioId));
  }

  async deleteNoticiasByUsuarioId(usuarioId: number) {
    await db.delete(noticia).where(eq(noticia.usuario_id, usuarioId));
  }

  async deleteAlarmasByUsuarioId(usuarioId: number) {
    await db.delete(alarma).where(eq(alarma.usuario_id, usuarioId));
  }

  async createAdmin(data: { usuario_id: number; correo?: string; telefono?: string; cedula?: string; contrasena: string }) {
    return db.insert(admin).values(data).returning();
  }

  async createRepresentante(data: { usuario_id: number; correo?: string; c_i?: string; centro_medico_id?: number; contrasena: string }) {
    return db.insert(representante).values(data).returning();
  }

  async findAdminByUsuarioId(usuarioId: number) {
    return db.select().from(admin).where(eq(admin.usuario_id, usuarioId)).limit(1);
  }

  async findRepresentanteByUsuarioId(usuarioId: number) {
    return db.select().from(representante).where(eq(representante.usuario_id, usuarioId)).limit(1);
  }

  async updateAdmin(usuarioId: number, data: Record<string, unknown>) {
    return db.update(admin).set(data).where(eq(admin.usuario_id, usuarioId)).returning();
  }

  async updateRepresentante(usuarioId: number, data: Record<string, unknown>) {
    return db.update(representante).set(data).where(eq(representante.usuario_id, usuarioId)).returning();
  }
}
