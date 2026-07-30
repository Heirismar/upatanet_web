import { NoticiaRepository } from '../repositories/noticia.repository';
import { ReactionRepository } from '../repositories/reaction.repository';
import { getPaginationParams, paginatedResponse } from '../utils/pagination.util';
import type { CreateNoticiaDTO, UpdateNoticiaDTO, NoticiaResponse } from '../models/schemas.dto';
import type { PaginatedResponse, PaginationParams } from '../utils/pagination.util';

export class NoticiaService {
  private repo = new NoticiaRepository();
  private reactionRepo = new ReactionRepository();

  async list(query: PaginationParams & { usuarioId?: number }): Promise<PaginatedResponse<NoticiaResponse>> {
    const { page, limit, offset } = getPaginationParams(query);
    const [data, total] = await Promise.all([
      this.repo.findAll(limit, offset),
      this.repo.countAll(),
    ]);
    const result = data as NoticiaResponse[];
    if (query.usuarioId) {
      const ids = result.map(n => n.id);
      const reactions = await this.reactionRepo.findReactionsByUser(ids, query.usuarioId);
      result.forEach(n => { n.userReaction = reactions[n.id] ?? null; });
    }
    return paginatedResponse(result, total, page, limit);
  }

  async getById(id: number): Promise<NoticiaResponse> {
    const [found] = await this.repo.findById(id);
    if (!found) throw new Error('Noticia no encontrada');
    return found as NoticiaResponse;
  }

  async create(data: CreateNoticiaDTO): Promise<NoticiaResponse> {
    const [created] = await this.repo.create({ ...data, datetime: new Date().toISOString() });
    return created as NoticiaResponse;
  }

  async update(id: number, data: UpdateNoticiaDTO): Promise<NoticiaResponse> {
    await this.getById(id);
    const [updated] = await this.repo.update(id, data);
    return updated as NoticiaResponse;
  }

  async remove(id: number): Promise<void> {
    await this.getById(id);
    await this.reactionRepo.deleteByNoticia(id);
    await this.repo.delete(id);
  }

  async toggleReaction(usuarioId: number, noticiaId: number, tipo: 'like' | 'dislike'): Promise<NoticiaResponse> {
    const noticia = await this.getById(noticiaId);
    const existing = await this.reactionRepo.findByUserAndNoticia(usuarioId, noticiaId);

    let likes = noticia.likes ?? 0;
    let dislikes = noticia.dislikes ?? 0;

    if (!existing) {
      await this.reactionRepo.create(usuarioId, noticiaId, tipo);
      if (tipo === 'like') likes += 1;
      else dislikes += 1;
    } else if (existing.tipo === tipo) {
      await this.reactionRepo.delete(existing.id);
      if (tipo === 'like') likes = Math.max(0, likes - 1);
      else dislikes = Math.max(0, dislikes - 1);
    } else {
      await this.reactionRepo.update(existing.id, tipo);
      if (tipo === 'like') { likes += 1; dislikes = Math.max(0, dislikes - 1); }
      else { dislikes += 1; likes = Math.max(0, likes - 1); }
    }

    const [updated] = await this.repo.update(noticiaId, { likes, dislikes });
    const resp = updated as NoticiaResponse;
    resp.userReaction = existing && existing.tipo === tipo ? null : tipo;
    return resp;
  }
}
