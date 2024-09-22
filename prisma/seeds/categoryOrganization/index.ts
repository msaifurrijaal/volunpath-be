import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categoryOrganizations = [
  {
    id: 1,
    name: 'Category Organization 1',
    description: 'Category Organization 1',
  },
  {
    id: 2,
    name: 'Category Organization 2',
    description: 'Category Organization 2',
  },
  {
    id: 3,
    name: 'Category Organization 3',
    description: 'Category Organization 3',
  },
];

export async function seedCategoryOrganizations() {
  const seeder = categoryOrganizations.map((categoryOrganization) => {
    return prisma.categoryOrganization.upsert({
      where: { id: categoryOrganization.id },
      update: categoryOrganization,
      create: categoryOrganization,
    });
  });

  const results = await Promise.all(seeder);

  console.log('Category Organization created or updated:', results);
}
