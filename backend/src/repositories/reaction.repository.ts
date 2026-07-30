import { eq, and } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { db } from '../config/db.config';
import { noticiaReaction } from '../database/schemas/schema';

export class ReactionRepository {
  async findByUserAndNoticia(usuarioId: number, noticiaId: number) {
    const [found] = await db
      .select()
      .from(noticiaReaction)
      .where(and(eq(noticiaReaction.usuario_id, usuarioId), eq(noticiaReaction.noticia_id, noticiaId)))
      .limit(1);
    return found || null;
  }

  async create(usuarioId: number, noticiaId: number, tipo: string) {
    const [created] = await db
      .insert(noticiaReaction)
      .values({ usuario_id: usuarioId, noticia_id: noticiaId, tipo })
      .returning();
    return created;
  }

  async update(id: number, tipo: string) {
    const [updated] = await db
      .update(noticiaReaction)
      .set({ tipo })
      .where(eq(noticiaReaction.id, id))
      .returning();
    return updated;
  }

  async delete(id: number) {
    await db.delete(noticiaReaction).where(eq(noticiaReaction.id, id));
  }

  async deleteByNoticia(noticiaId: number) {
    await db.delete(noticiaReaction).where(eq(noticiaReaction.noticia_id, noticiaId));
  }

  async countByTipo(noticiaId: number, tipo: string): Promise<number> {
    const [result] = await db
      .select({ total: sql<number>`count(*)` })
      .from(noticiaReaction)
      .where(and(eq(noticiaReaction.noticia_id, noticiaId), eq(noticiaReaction.tipo, tipo)));
    return result.total;
  }

  async findReactionsByUser(noticiaIds: number[], usuarioId: number): Promise<Record<number, string | null>> {
    if (noticiaIds.length === 0) return {};
    const rows = await db
      .select()
      .from(noticiaReaction)
      .where(eq(noticiaReaction.usuario_id, usuarioId));
    const map: Record<number, string | null> = {};
    noticiaIds.forEach(id => { map[id] = null; });
    rows.forEach(r => { if (r.noticia_id !== null) map[r.noticia_id] = r.tipo; });
    return map;
  }
}
