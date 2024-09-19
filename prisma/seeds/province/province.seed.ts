import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const provinces = [
  { id: 1, name: 'Province A' },
  { id: 2, name: 'Province B' },
  { id: 3, name: 'Province C' },
];

export async function seedProvinces() {
  const seeder = provinces.map((province) => {
    return prisma.province.upsert({
      where: { id: province.id },
      update: province,
      create: province,
    });
  });

  const results = await Promise.all(seeder);
  console.log('Provinces created or updated:', results);
}
