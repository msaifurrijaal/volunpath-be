import { PrismaClient } from '@prisma/client';
import { seedRoles } from './role/role.seed';
import { seedProvinces } from './province/province.seed';
import { seedRegencies } from './regency/regency.seed';
import { seedSkills } from './skill/skill.seed';
import { seedEducations } from './education/education.seed';
import { seedCategoryOrganizations } from './categoryOrganization';

const prisma = new PrismaClient();

async function main() {
  await seedRoles();
  console.log('Role seeded successfully!');

  await seedProvinces();
  console.log('Province seeded successfully!');

  await seedRegencies();
  console.log('Regency seeded successfully!');

  await seedSkills();
  console.log('Skill seeded successfully!');

  await seedEducations();
  console.log('Education seeded successfully!');

  await seedCategoryOrganizations();
  console.log('Category Organization seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
