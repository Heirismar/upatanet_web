import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core';

export const comunidad = sqliteTable('comunidad', {
  id: text('id').primaryKey(),
  nombre: text('nombre'),
  latitud: real('latitud'),
  longitud: real('longitud'),
  reloj_logico: text('reloj_logico'),
});

export const comunidadVecina = sqliteTable('comunidad_vecina', {
  comunidad_id: text('comunidad_id').notNull().references(() => comunidad.id),
  vecina_id: text('vecina_id').notNull().references(() => comunidad.id),
});

export const usuario = sqliteTable('usuario', {
  id: text('id').primaryKey(),
  nombre: text('nombre'),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  titulo: text('titulo'),
  comunidad_id: text('comunidad_id').references(() => comunidad.id),
  id_nodo: text('id_nodo'),
  idioma: text('idioma'),
  reloj_logico: text('reloj_logico'),
});

export const categoriaAlerta = sqliteTable('categoria_alerta', {
  codigo: text('codigo').primaryKey(),
  etiqueta: text('etiqueta'),
  color_hex: text('color_hex'),
  descripcion: text('descripcion'),
});

export const reporte = sqliteTable('reporte', {
  id: text('id').primaryKey(),
  titulo: text('titulo'),
  cuerpo: text('cuerpo'),
  categoria_codigo: text('categoria_codigo').references(() => categoriaAlerta.codigo),
  autor_id: text('autor_id').references(() => usuario.id),
  comunidad_id: text('comunidad_id').references(() => comunidad.id),
  latitud: real('latitud'),
  longitud: real('longitud'),
  creado_en: text('creado_en'),
  reloj_logico: text('reloj_logico'),
  ttl: integer('ttl'),
  nodo_origen: text('nodo_origen'),
  eliminado: integer('eliminado'),
});

export const centroSalud = sqliteTable('centro_salud', {
  id: text('id').primaryKey(),
  nombre: text('nombre'),
  comunidad_id: text('comunidad_id').references(() => comunidad.id),
  contacto: text('contacto'),
  reloj_logico: text('reloj_logico'),
});

export const tipoJornada = sqliteTable('tipo_jornada', {
  codigo: text('codigo').primaryKey(),
  etiqueta: text('etiqueta'),
});

export const jornadaMedica = sqliteTable('jornada_medica', {
  id: text('id').primaryKey(),
  nombre: text('nombre'),
  tipo_codigo: text('tipo_codigo').references(() => tipoJornada.codigo),
  descripcion: text('descripcion'),
  fecha_inicial: text('fecha_inicial'),
  fecha_final: text('fecha_final'),
  centro_salud_id: text('centro_salud_id').references(() => centroSalud.id),
  comunidad_id: text('comunidad_id').references(() => comunidad.id),
  latitud: real('latitud'),
  longitud: real('longitud'),
  creado_en: text('creado_en'),
  reloj_logico: text('reloj_logico'),
  eliminado: integer('eliminado'),
});

export const verificacion = sqliteTable('verificacion', {
  id: text('id').primaryKey(),
  reporte_id: text('reporte_id').references(() => reporte.id),
  usuario_id: text('usuario_id').references(() => usuario.id),
  valor: integer('valor'),
  reloj_logico: text('reloj_logico'),
});
