const API = '/api/noticia';

export interface NoticiaResponse {
  id: number;
  usuario_id: number | null;
  titulo: string | null;
  descripcion: string | null;
  categoria: string | null;
  datetime: string | null;
  likes: number | null;
  dislikes: number | null;
  userReaction?: string | null;
}

async function handleResponse(res: Response) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Error ${res.status}`);
  }
  return res.json();
}

export async function listNoticiasService(page = 1, limit = 10): Promise<{ data: NoticiaResponse[]; total: number; page: number; limit: number; totalPages: number }> {
  const res = await fetch(`${API}/list?page=${page}&limit=${limit}`);
  return handleResponse(res);
}

export async function getNoticiaByIdService(id: number): Promise<NoticiaResponse> {
  const res = await fetch(`${API}/${id}`);
  return handleResponse(res);
}

export async function createNoticiaService(data: { usuario_id: number; titulo?: string; descripcion?: string; categoria?: string }, token: string): Promise<NoticiaResponse> {
  const res = await fetch(`${API}/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateNoticiaService(id: number, data: Partial<{ titulo: string; descripcion: string; categoria: string }>, token: string): Promise<NoticiaResponse> {
  const res = await fetch(`${API}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function toggleReactionService(id: number, tipo: 'like' | 'dislike', token: string): Promise<NoticiaResponse> {
  const res = await fetch(`${API}/${id}/${tipo}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}

export async function deleteNoticiaService(id: number, token: string): Promise<void> {
  const res = await fetch(`${API}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Error ${res.status}`);
  }
}
