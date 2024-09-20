import { PrismaClient } from '@prisma/client';

export class UserRepository {
  name = 'userRepository';
  db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async findUserByEmail(email: string) {
    return this.db.user.findUnique({ where: { email } });
  }

  async findUserById(id: number) {
    return this.db.user.findUnique({ where: { id } });
  }
}

export default UserRepository;
