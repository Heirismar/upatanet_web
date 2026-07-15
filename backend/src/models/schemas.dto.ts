//aca van los dtos de cada estructura de las tablas


export interface CreateComunidadDTO {
  nombre?: string;
  latitud?: number;
  longitud?: number;
}
export interface UpdateComunidadDTO extends Partial<CreateComunidadDTO> { }
export interface ComunidadResponse {
  id: string;
  nombre: string | null;
  latitud: number | null;
  longitud: number | null;
  reloj_logico: string | null;
}


export interface CreateComunidadVecinaDTO {
  comunidad_id: string;
  vecina_id: string;
}
export type UpdateComunidadVecinaDTO = Partial<CreateComunidadVecinaDTO>;
export interface ComunidadVecinaResponse {
  comunidad_id: string;
  vecina_id: string;
}


export interface CreateUserDTO {
  nombre: string;
  email: string;
  password: string;
  titulo?: string;
  comunidad_id?: string;
  id_nodo?: string;
  idioma?: string;
}
export interface UpdateUserDTO extends Partial<CreateUserDTO> { }
export interface UserResponse {
  id: string;
  nombre: string | null;
  email: string;
  titulo: string | null;
  comunidad_id: string | null;
  id_nodo: string | null;
  idioma: string | null;
  reloj_logico: string | null;
}
export interface UserLoginDTO {
  email: string;
  password: string;
}

export interface CreateCategoriaAlertaDTO {
  codigo: string;
  etiqueta?: string;
  color_hex?: string;
  descripcion?: string;
}
export interface UpdateCategoriaAlertaDTO extends Partial<CreateCategoriaAlertaDTO> { }
export interface CategoriaAlertaResponse {
  codigo: string;
  etiqueta: string | null;
  color_hex: string | null;
  descripcion: string | null;
}


export interface CreateReporteDTO {
  titulo?: string;
  cuerpo?: string;
  categoria_codigo?: string;
  autor_id?: string;
  comunidad_id?: string;
  latitud?: number;
  longitud?: number;
  ttl?: number;
  nodo_origen?: string;
}
export interface UpdateReporteDTO extends Partial<CreateReporteDTO> {
  eliminado?: number;
}
export interface ReporteResponse {
  id: string;
  titulo: string | null;
  cuerpo: string | null;
  categoria_codigo: string | null;
  autor_id: string | null;
  comunidad_id: string | null;
  latitud: number | null;
  longitud: number | null;
  creado_en: string | null;
  reloj_logico: string | null;
  ttl: number | null;
  nodo_origen: string | null;
  eliminado: number | null;
}


export interface CreateCentroSaludDTO {
  nombre?: string;
  comunidad_id?: string;
  contacto?: string;
}
export interface UpdateCentroSaludDTO extends Partial<CreateCentroSaludDTO> { }
export interface CentroSaludResponse {
  id: string;
  nombre: string | null;
  comunidad_id: string | null;
  contacto: string | null;
  reloj_logico: string | null;
}


export interface CreateTipoJornadaDTO {
  codigo: string;
  etiqueta?: string;
}
export interface UpdateTipoJornadaDTO extends Partial<CreateTipoJornadaDTO> { }
export interface TipoJornadaResponse {
  codigo: string;
  etiqueta: string | null;
}


export interface CreateJornadaMedicaDTO {
  nombre?: string;
  tipo_codigo?: string;
  descripcion?: string;
  fecha_inicial?: string;
  fecha_final?: string;
  centro_salud_id?: string;
  comunidad_id?: string;
  latitud?: number;
  longitud?: number;
}
export interface UpdateJornadaMedicaDTO extends Partial<CreateJornadaMedicaDTO> {
  eliminado?: number;
}
export interface JornadaMedicaResponse {
  id: string;
  nombre: string | null;
  tipo_codigo: string | null;
  descripcion: string | null;
  fecha_inicial: string | null;
  fecha_final: string | null;
  centro_salud_id: string | null;
  comunidad_id: string | null;
  latitud: number | null;
  longitud: number | null;
  creado_en: string | null;
  reloj_logico: string | null;
  eliminado: number | null;
}


export interface CreateVerificacionDTO {
  reporte_id?: string;
  usuario_id?: string;
  valor?: number;
}
export interface UpdateVerificacionDTO extends Partial<CreateVerificacionDTO> { }
export interface VerificacionResponse {
  id: string;
  reporte_id: string | null;
  usuario_id: string | null;
  valor: number | null;
  reloj_logico: string | null;
}
