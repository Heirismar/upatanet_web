import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { envConfig } from '../config/env.config';
import { AuthRepository } from '../repositories/auth.repository';
import type { CreateUserDTO, UserResponse, UserLoginDTO } from '../models/schemas.dto';

export class AuthService {
  private repo = new AuthRepository();

  async register(data: CreateUserDTO): Promise<{ user: UserResponse; token: string }> {
    const [existente] = await this.repo.findByEmail(data.email);
    if (existente) throw new Error('El email ya está registrado');

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const [created] = await this.repo.create({
      id: crypto.randomUUID(),
      nombre: data.nombre,
      email: data.email,
      password: hashedPassword,
      titulo: data.titulo,
      comunidad_id: data.comunidad_id,
      id_nodo: data.id_nodo,
      idioma: data.idioma,
      reloj_logico: new Date().toISOString(),
    });

    const token = this.generateToken(created.id);
    return { user: created as UserResponse, token };
  }

  async login(credentials: UserLoginDTO): Promise<{ user: UserResponse; token: string }> {
    const [found] = await this.repo.findByEmail(credentials.email);
    if (!found) throw new Error('Credenciales inválidas');

    const valid = await bcrypt.compare(credentials.password, found.password);
    if (!valid) throw new Error('Credenciales inválidas');

    const token = this.generateToken(found.id);
    return { user: found as UserResponse, token };
  }

  async getProfile(userId: string): Promise<UserResponse> {
    const [found] = await this.repo.findById(userId);
    if (!found) throw new Error('Usuario no encontrado');
    return found as UserResponse;
  }

  private generateToken(userId: string): string {
    return jwt.sign({ userId }, envConfig.jwt.secret, { expiresIn: envConfig.jwt.expiresIn } as jwt.SignOptions);
  }
}
