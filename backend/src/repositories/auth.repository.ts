import { eq } from 'drizzle-orm';
import { db } from '../config/db.config';
import { usuario } from '../database/schemas/schema';
import type { CreateUserDTO, UserResponse } from '../models/schemas.dto';

export class AuthRepository {
  async findByEmail(email: string) {
    return db.select().from(usuario).where(eq(usuario.email, email)).limit(1);
  }

  async findById(id: string) {
    return db.select().from(usuario).where(eq(usuario.id, id)).limit(1);
  }

  async create(data: CreateUserDTO & { id: string; password: string; reloj_logico: string }) {
    await db.insert(usuario).values(data);
    return this.findById(data.id);
  }
}
