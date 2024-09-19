import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const regencies = [
  { id: 1, name: 'Regency A1', provinceId: 1 },
  { id: 2, name: 'Regency A2', provinceId: 1 },
  { id: 3, name: 'Regency A3', provinceId: 1 },
  { id: 4, name: 'Regency B1', provinceId: 2 },
  { id: 5, name: 'Regency B2', provinceId: 2 },
  { id: 6, name: 'Regency B3', provinceId: 2 },
  { id: 7, name: 'Regency C1', provinceId: 3 },
  { id: 8, name: 'Regency C2', provinceId: 3 },
  { id: 9, name: 'Regency C3', provinceId: 3 },
];

export async function seedRegencies() {
  const seeder = regencies.map((regency) => {
    return prisma.regency.upsert({
      where: { id: regency.id },
      update: regency,
      create: regency,
    });
  });

  const results = await Promise.all(seeder);
  console.log('Regencies created or updated:', results);
}
