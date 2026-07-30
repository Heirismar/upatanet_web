import bcrypt from 'bcryptjs';
import { db } from './config/db.config';
import { usuario, admin, representante, centroMedico, comunidad, noticia, alarma, jornada } from './database/schemas/schema';

async function seed() {
  const hash = await bcrypt.hash('123456', 12);

  const nombres = ['Admin', 'Carlos', 'José', 'María', 'Ana', 'Luis', 'Pedro', 'Sofía', 'Diego', 'Laura'];
  const apellidos = ['Principal', 'Pérez', 'Rodríguez', 'García', 'Martínez', 'López', 'Hernández', 'González', 'Díaz', 'Moreno'];
  const roles = ['admin', 'representante', 'representante', 'representante', 'representante', 'representante', 'representante', 'representante', 'representante', 'representante'];

  const users: { id: number; rol: string }[] = [];
  for (let i = 0; i < 10; i++) {
    const [u] = await db.insert(usuario).values({ nombre: nombres[i], apellido: apellidos[i], rol: roles[i] }).returning();
    users.push(u);
  }

  const centros: { id: number }[] = [];
  const centrosRaw = [
    { nombre: 'Ambulatorio Ocamo', correo: 'ocamo@salud.gob.ve', ubicacion: 'Río Ocamo, Estado Amazonas', rif: 'J-10000001-0', telefono: '0414-1000001' },
    { nombre: 'CDI La Esmeralda', correo: 'esmeralda@salud.gob.ve', ubicacion: 'La Esmeralda, Estado Amazonas', rif: 'J-10000002-1', telefono: '0414-1000002' },
    { nombre: 'Hospital San Carlos', correo: 'sancarlos@salud.gob.ve', ubicacion: 'San Carlos de Río Negro, Amazonas', rif: 'J-10000003-2', telefono: '0414-1000003' },
    { nombre: 'Ambulatorio Maroa', correo: 'maroa@salud.gob.ve', ubicacion: 'Maroa, Estado Amazonas', rif: 'J-10000004-3', telefono: '0414-1000004' },
    { nombre: 'CDI Atabapo', correo: 'atabapo@salud.gob.ve', ubicacion: 'San Fernando de Atabapo, Amazonas', rif: 'J-10000005-4', telefono: '0414-1000005' },
    { nombre: 'Hospital del Táchira', correo: 'tachira@salud.gob.ve', ubicacion: 'San Cristóbal, Estado Táchira', rif: 'J-10000006-5', telefono: '0414-1000006' },
    { nombre: 'Ambulatorio Santa Elena', correo: 'santaelena@salud.gob.ve', ubicacion: 'Santa Elena de Uairén, Bolívar', rif: 'J-10000007-6', telefono: '0414-1000007' },
    { nombre: 'CDI Puerto Ayacucho', correo: 'ayacucho@salud.gob.ve', ubicacion: 'Puerto Ayacucho, Amazonas', rif: 'J-10000008-7', telefono: '0414-1000008' },
    { nombre: 'Misión Barrio Adentro', correo: 'barrio@salud.gob.ve', ubicacion: 'Barrio Adentro, Amazonas', rif: 'J-10000009-8', telefono: '0414-1000009' },
    { nombre: 'Hospital Pediátrico', correo: 'pediatrico@salud.gob.ve', ubicacion: 'Ciudad Bolívar, Estado Bolívar', rif: 'J-10000010-9', telefono: '0414-1000010' },
  ];
  for (const c of centrosRaw) {
    const [cm] = await db.insert(centroMedico).values(c).returning();
    centros.push(cm);
  }

  await db.insert(admin).values({
    usuario_id: users[0].id, correo: 'admin@upatanet.com', contrasena: hash, telefono: '0414-0000000', cedula: 'V-12345678',
  });

  const comunidadesRaw = [
    { nombre: 'Comunidad Ocamo', latitud: '2.8333', longitud: '-65.2167' },
    { nombre: 'Comunidad La Esmeralda', latitud: '3.1667', longitud: '-65.5500' },
    { nombre: 'Comunidad San Carlos', latitud: '1.9167', longitud: '-67.0500' },
    { nombre: 'Comunidad Maroa', latitud: '2.7167', longitud: '-67.5667' },
    { nombre: 'Comunidad Atabapo', latitud: '4.0500', longitud: '-67.7000' },
    { nombre: 'Comunidad Santa Elena', latitud: '4.6000', longitud: '-61.1000' },
    { nombre: 'Comunidad Puerto Ayacucho', latitud: '5.6667', longitud: '-67.6333' },
    { nombre: 'Comunidad Río Negro', latitud: '1.9000', longitud: '-67.0833' },
    { nombre: 'Comunidad Guainía', latitud: '2.8000', longitud: '-67.6333' },
    { nombre: 'Comunidad Caura', latitud: '7.6333', longitud: '-64.8833' },
  ];
  const comunidades: { id: number }[] = [];
  for (const c of comunidadesRaw) {
    const [com] = await db.insert(comunidad).values(c).returning();
    comunidades.push(com);
  }

  let repIdx = 0;
  for (let i = 0; i < 10; i++) {
    if (users[i].rol === 'representante') {
      await db.insert(representante).values({
        usuario_id: users[i].id, centro_medico_id: centros[repIdx].id, correo: `representante${repIdx + 1}@upatanet.com`, c_i: `V-${80000000 + repIdx}`, contrasena: hash,
      });
      repIdx++;
    }
  }

  const categorias = ['salud', 'noticias', 'eventos', 'salud', 'comunicados', 'salud', 'noticias', 'eventos', 'salud', 'comunicados'];
  const titulosNoticias = [
    'Jornada de vacunación este sábado',
    'Nuevo equipo médico recibido',
    'Taller de prevención de enfermedades',
    'Campaña de desparasitación masiva',
    'Reunión comunitaria de salud',
    'Entrega de medicamentos gratuitos',
    'Capacitación en primeros auxilios',
    'Jornada de salud bucal',
    'Donación de sillas de ruedas',
    'Charla sobre nutrición infantil',
  ];
  for (let i = 0; i < 10; i++) {
    await db.insert(noticia).values({
      usuario_id: users[0].id, titulo: titulosNoticias[i], descripcion: `Descripción de: ${titulosNoticias[i]}. Actividad organizada para beneficio de la comunidad.`, categoria: categorias[i], datetime: new Date().toISOString(), likes: Math.floor(Math.random() * 50), dislikes: Math.floor(Math.random() * 10),
    });
  }

  const allNoticias = await db.select().from(noticia);
  for (let i = 0; i < 10; i++) {
    const repUser = users.find(u => u.rol === 'representante');
    if (repUser) {
      await db.insert(alarma).values({
        usuario_id: repUser.id, noticia_id: allNoticias[i].id, datetime_inicio: new Date().toISOString(),
      });
    }
  }

  const titulosJornadas = [
    'Jornada de vacunación infantil',
    'Jornada de atención primaria',
    'Jornada de oftalmología',
    'Jornada de pediatría',
    'Jornada de cardiología',
    'Jornada de odontología',
    'Jornada de desparasitación',
    'Jornada de planificación familiar',
    'Jornada de salud mental',
    'Jornada de dermatología',
  ];
  const meses = [6, 7, 8, 9, 10, 11];
  for (let i = 0; i < 10; i++) {
    const mes = meses[i % meses.length];
    const dia = 1 + i;
    const cmIdx = i % centros.length;
    await db.insert(jornada).values({
      centro_medico_id: centros[cmIdx].id, titulo: titulosJornadas[i], descripcion: `${titulosJornadas[i]} dirigida a toda la comunidad.`, datetime_inicio: `2026-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}T08:00:00`, datetime_fin: `2026-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}T16:00:00`, ubicacion: centros[cmIdx].nombre,
    });
  }

  console.log('Seed completado: 10 registros en cada tabla');
}

seed().catch((err) => {
  console.error('seed failed', err);
  process.exit(1);
});
