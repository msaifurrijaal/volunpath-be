import { PrismaClient } from '@prisma/client';
import { CreateUserVolunteerReq } from '../types/apps/user.type';

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

  async createUserVolunteer(data: CreateUserVolunteerReq) {
    const { volunteerDetail, ...userData } = data;
    const transaction = await this.db.$transaction(async (prisma) => {
      const user = await prisma.user.create({ data: userData });

      await prisma.volunteerDetail.create({
        data: {
          userId: user.id,
          ...volunteerDetail,
        },
      });

      return user;
    });

    return transaction;
  }
}

export default UserRepository;
