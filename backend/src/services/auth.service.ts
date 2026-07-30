import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { envConfig } from '../config/env.config';
import { AuthRepository } from '../repositories/auth.repository';
import type { RepresentanteResponse } from '../models/schemas.dto';

export class AuthService {
  private repo = new AuthRepository();

  async register(data: {
    nombre: string;
    apellido: string;
    correo: string;
    contrasena: string;
    c_i?: string;
  }) {
    const [existente] = await this.repo.findRepresentanteByCorreo(data.correo);
    if (existente) throw new Error('El correo ya está registrado');

    const hashedPassword = await bcrypt.hash(data.contrasena, 12);

    const [newUsuario] = await this.repo.createUsuario({
      nombre: data.nombre,
      apellido: data.apellido,
      rol: 'representante',
    });

    const [newRepresentante] = await this.repo.createRepresentante({
      usuario_id: newUsuario.id,
      correo: data.correo,
      contrasena: hashedPassword,
      c_i: data.c_i,
    });

    const token = this.generateToken(newUsuario.id);
    return { user: newRepresentante, token, role: 'representante' };
  }

  async login(credentials: { correo: string; contrasena: string }) {
    const [adminFound] = await this.repo.findByCorreo(credentials.correo);
    if (adminFound) {
      const valid = await bcrypt.compare(credentials.contrasena, adminFound.contrasena!);
      if (!valid) throw new Error('Credenciales inválidas');
      const token = this.generateToken(adminFound.usuario_id!);
      return { user: adminFound, token, role: 'admin' };
    }

    const [repFound] = await this.repo.findRepresentanteByCorreo(credentials.correo);
    if (repFound) {
      const valid = await bcrypt.compare(credentials.contrasena, repFound.contrasena!);
      if (!valid) throw new Error('Credenciales inválidas');
      const token = this.generateToken(repFound.usuario_id!);
      return { user: repFound, token, role: 'representante' };
    }

    throw new Error('Credenciales inválidas');
  }

  async getProfile(usuarioId: number) {
    const [found] = await this.repo.findUsuarioById(usuarioId);
    if (!found) throw new Error('Usuario no encontrado');

    if (found.rol === 'representante') {
      const [rep] = await this.repo.findRepresentanteByUsuarioId(usuarioId);
      return { ...found, centro_medico_id: rep?.centro_medico_id ?? null };
    }

    return found;
  }

  async updateCentroMedico(usuarioId: number, centroMedicoId: number) {
    const [found] = await this.repo.findRepresentanteByUsuarioId(usuarioId);
    if (!found) throw new Error('Representante no encontrado');
    const [updated] = await this.repo.updateRepresentanteCentroMedico(usuarioId, centroMedicoId);
    return updated;
  }

  private generateToken(usuarioId: number): string {
    return jwt.sign({ usuarioId }, envConfig.jwt.secret, { expiresIn: envConfig.jwt.expiresIn } as jwt.SignOptions);
  }
}
