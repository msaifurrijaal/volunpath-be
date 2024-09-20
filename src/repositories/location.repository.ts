import { PrismaClient, Province } from '@prisma/client';

export class LocationRepository {
  name = 'locationRepository';

  constructor(public db: PrismaClient) {}

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
      where: { name: { contains: search } },
    });

    const provinces = await this.db.province.findMany({
      where: { name: { contains: search } },
      take: limit ?? 10,
      skip: offset ?? 0,
    });

    return { provinces, total };
  }
}

export default LocationRepository;
