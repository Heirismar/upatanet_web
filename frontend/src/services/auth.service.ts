const API = '/api/auth';

export interface RegisterDTO {
  nombre: string;
  apellido: string;
  correo: string;
  contrasena: string;
  c_i?: string;
}

export interface LoginDTO {
  correo: string;
  contrasena: string;
}

export interface RepresentanteResponse {
  id: number;
  usuario_id: number | null;
  centro_medico_id: number | null;
  correo: string | null;
  c_i: string | null;
}

export interface UsuarioResponse {
  id: number;
  nombre: string | null;
  apellido: string | null;
  rol: string | null;
  centro_medico_id?: number | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface AuthResponse {
  user: any;
  token: string;
  role: string;
}

async function handleResponse(res: Response) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Error ${res.status}`);
  }
  return res.json();
}

export async function registerService(data: RegisterDTO): Promise<AuthResponse> {
  const res = await fetch(`${API}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function loginService(data: LoginDTO): Promise<AuthResponse> {
  const res = await fetch(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function getProfileService(token: string): Promise<UsuarioResponse> {
  const res = await fetch(`${API}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(res);
}
