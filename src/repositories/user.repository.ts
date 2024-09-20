import { PrismaClient } from '@prisma/client';

export class UserRepository {
  name = 'userRepository';

  constructor(public db: PrismaClient) {}

  async findUserByEmail(email: string) {
    return this.db.user.findUnique({ where: { email } });
  }

  async findUserById(id: number) {
    return this.db.user.findUnique({ where: { id } });
  }
}

export default UserRepository;
