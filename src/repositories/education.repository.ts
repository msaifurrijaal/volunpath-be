import { PrismaClient } from '@prisma/client';

export class EducationRepository {
  name = 'educationRepository';
  db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async getEducations() {
    return this.db.education.findMany({
      orderBy: { id: 'asc' },
    });
  }
}

export default EducationRepository;
