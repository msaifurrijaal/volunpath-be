import { PrismaClient, Province } from '@prisma/client';

export class LocationRepository {
  name = 'locationRepository';
  db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  async getProvinces({
    limit,
    offset,
    search,
  }: {
    limit?: number;
    offset?: number;
    search: string;
  }): Promise<{ provinces: Province[]; total: number }> {
    const total = await this.db.province.count({
      where: { name: { contains: search, mode: 'insensitive' } },
    });

    const provinces = await this.db.province.findMany({
      where: { name: { contains: search, mode: 'insensitive' } },
      take: limit ?? 10,
      skip: offset ?? 0,
    });

    return { provinces, total };
  }

  async getRegencies({
    provinceId,
    limit,
    offset,
    search,
  }: {
    provinceId: number;
    limit?: number;
    offset?: number;
    search: string;
  }): Promise<{ regencies: Province[]; total: number }> {
    const total = await this.db.regency.count({
      where: { name: { contains: search, mode: 'insensitive' }, provinceId },
    });

    const regencies = await this.db.regency.findMany({
      where: { name: { contains: search, mode: 'insensitive' }, provinceId },
      take: limit ?? 10,
      skip: offset ?? 0,
    });

    return { regencies, total };
  }
}

export default LocationRepository;
