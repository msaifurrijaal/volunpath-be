import { PrismaClient } from '@prisma/client';

export class SkillRepository {
  name = 'skillRepository';
  db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async getSkills() {
    return this.db.skill.findMany({
      orderBy: { id: 'asc' },
    });
  }
}

export default SkillRepository;
