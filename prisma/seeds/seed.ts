import { PrismaClient } from '@prisma/client';
import { seedRoles } from './role/role.seed';
import { seedProvinces } from './province/province.seed';
import { seedRegencies } from './regency/regency.seed';

const prisma = new PrismaClient();

async function main() {
  await seedRoles();
  console.log('Role seeded successfully!');

  await seedProvinces();
  console.log('Province seeded successfully!');

  await seedRegencies();
  console.log('Regency seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
