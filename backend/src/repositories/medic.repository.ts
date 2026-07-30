import { eq, count } from 'drizzle-orm';
import { db } from '../config/db.config';
import { jornada } from '../database/schemas/schema';
import type { CreateJornadaDTO, UpdateJornadaDTO } from '../models/schemas.dto';

export class JornadaRepository {
  async findAll(limit: number, offset: number) {
    return db.select().from(jornada).limit(limit).offset(offset);
  }

  async findById(id: number) {
    return db.select().from(jornada).where(eq(jornada.id, id)).limit(1);
  }

  async countAll() {
    const [result] = await db.select({ total: count() }).from(jornada);
    return result.total;
  }

  async create(data: CreateJornadaDTO) {
    return db.insert(jornada).values(data).returning();
  }

  async update(id: number, data: UpdateJornadaDTO) {
    return db.update(jornada).set(data).where(eq(jornada.id, id)).returning();
  }

  async delete(id: number) {
    await db.delete(jornada).where(eq(jornada.id, id));
  }
}
