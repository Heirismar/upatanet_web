import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const usuario = sqliteTable('usuario', {
  id: integer('id').primaryKey(),
  nombre: text('nombre'),
  apellido: text('apellido'),
  rol: text('rol'),
});

export const admin = sqliteTable('admin', {
  id: integer('id').primaryKey(),
  usuario_id: integer('usuario_id').references(() => usuario.id),
  correo: text('correo'),
  contrasena: text('contrasena'),
  telefono: text('telefono'),
  cedula: text('cedula'),
});

export const representante = sqliteTable('representante', {
  id: integer('id').primaryKey(),
  usuario_id: integer('usuario_id').references(() => usuario.id),
  centro_medico_id: integer('centro_medico_id').references(() => centroMedico.id),
  correo: text('correo'),
  c_i: text('c_i'),
  contrasena: text('contrasena'),
});

export const indigena = sqliteTable('indigena', {
  id: integer('id').primaryKey(),
  usuario_id: integer('usuario_id').references(() => usuario.id),
  comunidad_id: integer('comunidad_id').references(() => comunidad.id),
});

export const comunidad = sqliteTable('comunidad', {
  id: integer('id').primaryKey(),
  nombre: text('nombre'),
  latitud: text('latitud'),
  longitud: text('longitud'),
});

export const centroMedico = sqliteTable('centro_medico', {
  id: integer('id').primaryKey(),
  nombre: text('nombre'),
  correo: text('correo'),
  ubicacion: text('ubicacion'),
  rif: text('rif'),
  telefono: text('telefono'),
});

export const noticia = sqliteTable('noticia', {
  id: integer('id').primaryKey(),
  usuario_id: integer('usuario_id').references(() => usuario.id),
  titulo: text('titulo'),
  descripcion: text('descripcion'),
  categoria: text('categoria'),
  datetime: text('datetime'),
  likes: integer('likes'),
  dislikes: integer('dislikes'),
});

export const alarma = sqliteTable('alarma', {
  id: integer('id').primaryKey(),
  usuario_id: integer('usuario_id').references(() => usuario.id),
  noticia_id: integer('noticia_id').references(() => noticia.id),
  datetime_inicio: text('datetime_inicio'),
});

export const noticiaReaction = sqliteTable('noticia_reaction', {
  id: integer('id').primaryKey(),
  usuario_id: integer('usuario_id').references(() => usuario.id),
  noticia_id: integer('noticia_id').references(() => noticia.id),
  tipo: text('tipo'),
});

export const jornada = sqliteTable('jornada', {
  id: integer('id').primaryKey(),
  centro_medico_id: integer('centro_medico_id').references(() => centroMedico.id),
  titulo: text('titulo'),
  descripcion: text('descripcion'),
  datetime_inicio: text('datetime_inicio'),
  datetime_fin: text('datetime_fin'),
  ubicacion: text('ubicacion'),
});
