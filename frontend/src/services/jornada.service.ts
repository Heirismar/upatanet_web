const API = '/api/medic';

export interface CreateJornadaDTO {
  centro_medico_id: number;
  titulo?: string;
  descripcion?: string;
  datetime_inicio?: string;
  datetime_fin?: string;
  ubicacion?: string;
}

export interface JornadaResponse {
  id: number;
  centro_medico_id: number | null;
  titulo: string | null;
  descripcion: string | null;
  datetime_inicio: string | null;
  datetime_fin: string | null;
  ubicacion: string | null;
}

async function handleResponse(res: Response) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Error ${res.status}`);
  }
  return res.json();
}

export async function listJornadasService(page = 1, limit = 10, token?: string): Promise<{ data: JornadaResponse[]; total: number; page: number; limit: number; totalPages: number }> {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API}/list?page=${page}&limit=${limit}`, { headers });
  return handleResponse(res);
}

export async function deleteJornadaService(id: number, token: string): Promise<void> {
  const res = await fetch(`${API}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Error ${res.status}`);
  }
}

export async function getJornadaByIdService(id: number): Promise<JornadaResponse> {
  const res = await fetch(`${API}/${id}`);
  return handleResponse(res);
}

export async function updateJornadaService(id: number, data: Partial<CreateJornadaDTO>, token: string): Promise<JornadaResponse> {
  const res = await fetch(`${API}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function createJornadaService(data: CreateJornadaDTO, token: string): Promise<JornadaResponse> {
  const res = await fetch(`${API}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}
