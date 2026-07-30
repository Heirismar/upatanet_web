const API = '/api/usuario';

export interface UsuarioResponse {
  id: number;
  nombre: string | null;
  apellido: string | null;
  rol: string | null;
  correo?: string | null;
  telefono?: string | null;
  cedula?: string | null;
  c_i?: string | null;
  centro_medico_id?: number | null;
}

async function handleResponse(res: Response) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Error ${res.status}`);
  }
  return res.json();
}

export async function listUsuariosService(page = 1, limit = 10): Promise<{ data: UsuarioResponse[]; total: number; page: number; limit: number; totalPages: number }> {
  const res = await fetch(`${API}/list?page=${page}&limit=${limit}`);
  return handleResponse(res);
}

export async function createUsuarioService(data: { nombre: string; apellido: string; rol: string; correo?: string; telefono?: string; cedula?: string; c_i?: string; centro_medico_id?: number }, token: string): Promise<UsuarioResponse> {
  const res = await fetch(`${API}/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function getUsuarioByIdService(id: number): Promise<UsuarioResponse> {
  const res = await fetch(`${API}/${id}`);
  return handleResponse(res);
}

export async function updateUsuarioService(id: number, data: Partial<{ nombre: string; apellido: string; rol: string; correo: string; telefono: string; cedula: string; c_i: string; centro_medico_id: number }>, token: string): Promise<UsuarioResponse> {
  const res = await fetch(`${API}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteUsuarioService(id: number, token: string): Promise<void> {
  const res = await fetch(`${API}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Error ${res.status}`);
  }
}
