const API = '/api/centro-medico';
const AUTH_API = '/api/auth';

export interface CreateCentroMedicoDTO {
  nombre?: string;
  correo?: string;
  ubicacion?: string;
  rif?: string;
  telefono?: string;
}

export interface CentroMedicoResponse {
  id: number;
  nombre: string | null;
  correo: string | null;
  ubicacion: string | null;
  rif: string | null;
  telefono: string | null;
}

async function handleResponse(res: Response) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Error ${res.status}`);
  }
  return res.json();
}

export async function listCentrosMedicosService(page = 1, limit = 10): Promise<{ data: CentroMedicoResponse[]; total: number; page: number; limit: number; totalPages: number }> {
  const res = await fetch(`${API}/list?page=${page}&limit=${limit}`);
  return handleResponse(res);
}

export async function getCentroMedicoByIdService(id: number): Promise<CentroMedicoResponse> {
  const res = await fetch(`${API}/${id}`);
  return handleResponse(res);
}

export async function updateCentroMedicoService(id: number, data: Partial<CreateCentroMedicoDTO>, token: string): Promise<CentroMedicoResponse> {
  const res = await fetch(`${API}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteCentroMedicoService(id: number, token: string): Promise<void> {
  const res = await fetch(`${API}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Error ${res.status}`);
  }
}

export async function createCentroMedicoService(data: CreateCentroMedicoDTO, token?: string): Promise<CentroMedicoResponse> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API}/create`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateRepresentanteCentroMedicoService(centroMedicoId: number, token: string) {
  const res = await fetch(`${AUTH_API}/representante/centro-medico`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ centro_medico_id: centroMedicoId }),
  });
  return handleResponse(res);
}
