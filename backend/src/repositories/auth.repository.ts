import { eq } from 'drizzle-orm';
import { db } from '../config/db.config';
import { admin, representante, usuario } from '../database/schemas/schema';
import type { CreateAdminDTO } from '../models/schemas.dto';

export class AuthRepository {
  async findByCorreo(correo: string) {
    return db.select().from(admin).where(eq(admin.correo, correo)).limit(1);
  }

  async findRepresentanteByCorreo(correo: string) {
    return db.select().from(representante).where(eq(representante.correo, correo)).limit(1);
  }

  async findRepresentanteByUsuarioId(usuarioId: number) {
    return db.select().from(representante).where(eq(representante.usuario_id, usuarioId)).limit(1);
  }

  async updateRepresentanteCentroMedico(usuarioId: number, centroMedicoId: number) {
    return db.update(representante).set({ centro_medico_id: centroMedicoId }).where(eq(representante.usuario_id, usuarioId)).returning();
  }

  async findUsuarioById(id: number) {
    return db.select().from(usuario).where(eq(usuario.id, id)).limit(1);
  }

  async createUsuario(data: { nombre: string; apellido: string; rol: string }) {
    return db.insert(usuario).values(data).returning();
  }

  async createAdmin(data: CreateAdminDTO & { contrasena: string }) {
    return db.insert(admin).values(data).returning();
  }

  async createRepresentante(data: {
    usuario_id: number;
    correo: string;
    contrasena: string;
    c_i?: string;
    centro_medico_id?: number;
  }) {
    return db.insert(representante).values(data).returning();
  }
}
