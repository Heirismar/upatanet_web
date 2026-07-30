import { eq, count } from 'drizzle-orm';
import { db } from '../config/db.config';
import { centroMedico, representante, jornada } from '../database/schemas/schema';
import type { CreateCentroMedicoDTO } from '../models/schemas.dto';

export class CentroMedicoRepository {
  async findAll(limit: number, offset: number) {
    return db.select().from(centroMedico).limit(limit).offset(offset);
  }

  async findById(id: number) {
    return db.select().from(centroMedico).where(eq(centroMedico.id, id)).limit(1);
  }

  async countAll() {
    const [result] = await db.select({ total: count() }).from(centroMedico);
    return result.total;
  }

  async create(data: CreateCentroMedicoDTO) {
    return db.insert(centroMedico).values(data).returning();
  }

  async update(id: number, data: Partial<CreateCentroMedicoDTO>) {
    return db.update(centroMedico).set(data).where(eq(centroMedico.id, id)).returning();
  }

  async delete(id: number) {
    await db.delete(centroMedico).where(eq(centroMedico.id, id));
  }

  async deleteJornadasByCentroMedicoId(centroMedicoId: number) {
    await db.delete(jornada).where(eq(jornada.centro_medico_id, centroMedicoId));
  }

  async nullifyRepresentantesCentroMedico(centroMedicoId: number) {
    await db.update(representante).set({ centro_medico_id: null }).where(eq(representante.centro_medico_id, centroMedicoId));
  }
}
