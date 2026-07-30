// ─── Usuario ───
export interface CreateUsuarioDTO {
  nombre?: string;
  apellido?: string;
  rol?: string;
  correo?: string;
  telefono?: string;
  cedula?: string;
  c_i?: string;
  centro_medico_id?: number;
}
export interface UpdateUsuarioDTO extends Partial<CreateUsuarioDTO> {
  correo?: string;
  telefono?: string;
  cedula?: string;
  c_i?: string;
  centro_medico_id?: number;
}
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

// ─── Admin ───
export interface CreateAdminDTO {
  usuario_id: number;
  correo: string;
  contrasena: string;
  telefono?: string;
  cedula?: string;
}
export interface UpdateAdminDTO extends Partial<CreateAdminDTO> {}
export interface AdminResponse {
  id: number;
  usuario_id: number | null;
  correo: string | null;
  telefono: string | null;
  cedula: string | null;
}
export interface AdminLoginDTO {
  correo: string;
  contrasena: string;
}

// ─── Representante ───
export interface CreateRepresentanteDTO {
  usuario_id: number;
  centro_medico_id: number;
  correo: string;
  c_i?: string;
  contrasena: string;
}
export interface UpdateRepresentanteDTO extends Partial<CreateRepresentanteDTO> {}
export interface RepresentanteResponse {
  id: number;
  usuario_id: number | null;
  centro_medico_id: number | null;
  correo: string | null;
  c_i: string | null;
}

// ─── Indígena ───
export interface CreateIndigenaDTO {
  usuario_id: number;
  comunidad_id: number;
}
export interface UpdateIndigenaDTO extends Partial<CreateIndigenaDTO> {}
export interface IndigenaResponse {
  id: number;
  usuario_id: number | null;
  comunidad_id: number | null;
}

// ─── Comunidad ───
export interface CreateComunidadDTO {
  nombre?: string;
  latitud?: string;
  longitud?: string;
}
export interface UpdateComunidadDTO extends Partial<CreateComunidadDTO> {}
export interface ComunidadResponse {
  id: number;
  nombre: string | null;
  latitud: string | null;
  longitud: string | null;
}

// ─── Centro Médico ───
export interface CreateCentroMedicoDTO {
  nombre?: string;
  correo?: string;
  ubicacion?: string;
  rif?: string;
  telefono?: string;
}
export interface UpdateCentroMedicoDTO extends Partial<CreateCentroMedicoDTO> {}
export interface CentroMedicoResponse {
  id: number;
  nombre: string | null;
  correo: string | null;
  ubicacion: string | null;
  rif: string | null;
  telefono: string | null;
}

// ─── Noticia ───
export interface CreateNoticiaDTO {
  usuario_id: number;
  titulo?: string;
  descripcion?: string;
  categoria?: string;
}
export interface UpdateNoticiaDTO extends Partial<CreateNoticiaDTO> {
  likes?: number;
  dislikes?: number;
}
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

// ─── Alarma ───
export interface CreateAlarmaDTO {
  usuario_id: number;
  noticia_id: number;
  datetime_inicio?: string;
}
export interface UpdateAlarmaDTO extends Partial<CreateAlarmaDTO> {}
export interface AlarmaResponse {
  id: number;
  usuario_id: number | null;
  noticia_id: number | null;
  datetime_inicio: string | null;
}

// ─── Jornada ───
export interface CreateJornadaDTO {
  centro_medico_id: number;
  titulo?: string;
  descripcion?: string;
  datetime_inicio?: string;
  datetime_fin?: string;
  ubicacion?: string;
}
export interface UpdateJornadaDTO extends Partial<CreateJornadaDTO> {}
export interface JornadaResponse {
  id: number;
  centro_medico_id: number | null;
  titulo: string | null;
  descripcion: string | null;
  datetime_inicio: string | null;
  datetime_fin: string | null;
  ubicacion: string | null;
}
