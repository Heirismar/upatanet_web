import { eq, count, desc } from 'drizzle-orm';
import { db } from '../config/db.config';
import { noticia } from '../database/schemas/schema';
import type { CreateNoticiaDTO, UpdateNoticiaDTO } from '../models/schemas.dto';

export class NoticiaRepository {
  async findAll(limit: number, offset: number) {
    return db.select().from(noticia).orderBy(desc(noticia.datetime)).limit(limit).offset(offset);
  }

  async findById(id: number) {
    return db.select().from(noticia).where(eq(noticia.id, id)).limit(1);
  }

  async countAll() {
    const [result] = await db.select({ total: count() }).from(noticia);
    return result.total;
  }

  async create(data: CreateNoticiaDTO & { datetime: string }) {
    return db.insert(noticia).values(data).returning();
  }

  async update(id: number, data: UpdateNoticiaDTO) {
    return db.update(noticia).set(data).where(eq(noticia.id, id)).returning();
  }

  async delete(id: number) {
    await db.delete(noticia).where(eq(noticia.id, id));
  }
}
