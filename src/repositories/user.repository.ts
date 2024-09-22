import { Prisma, PrismaClient } from '@prisma/client';
import { CreateUserOrganizationReq, CreateUserVolunteerReq } from '../types/apps/user.type';
import bcrypt from 'bcrypt';
import { Error400 } from '../errors/http.errors';

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
    return this.db.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        fullname: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        role: true,
        organizationDetail: true,
        volunteerDetail: true,
      },
    });
  }

  async createUserVolunteer(data: CreateUserVolunteerReq) {
    try {
      const { volunteerDetail, skillIds, ...userData } = data;

      const transaction = await this.db.$transaction(async (prisma) => {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
          data: { ...userData, roleId: 2, password: hashedPassword },
        });

        const volunteer = await prisma.volunteerDetail.create({
          data: {
            userId: user.id,
            ...volunteerDetail,
          },
        });

        if (skillIds && skillIds.length > 0) {
          const volunteerSkills = skillIds.map((skillId) => ({
            volunteerDetailId: volunteer.id,
            skillId,
          }));

          await prisma.volunteerSkill.createMany({
            data: volunteerSkills,
          });
        }

        return user;
      });

      return transaction;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          const fieldName = error.meta?.field_name;
          throw new Error400({
            message: `The provided ${fieldName} does not exist, please provide a valid ${fieldName}`,
          });
        }
      }
      throw error;
    }
  }

  async createUserOrganization(data: CreateUserOrganizationReq) {
    try {
      const { organizationDetail, ...userData } = data;

      const transaction = await this.db.$transaction(async (prisma) => {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
          data: { ...userData, roleId: 3, password: hashedPassword },
        });

        await prisma.organizationDetail.create({
          data: {
            userId: user.id,
            ...organizationDetail,
          },
        });

        return user;
      });

      return transaction;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          const fieldName = error.meta?.field_name;
          throw new Error400({
            message: `The provided ${fieldName} does not exist, please provide a valid ${fieldName}`,
          });
        }
      }
      throw error;
    }
  }
}

export default UserRepository;
