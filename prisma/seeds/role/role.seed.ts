import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const roles = [
  {
    id: 1,
    name: 'admin',
  },
  {
    id: 2,
    name: 'volunteer',
  },
  {
    id: 3,
    name: 'organization',
  },
];

export async function seedRoles() {
  const seeder = roles.map((role) => {
    return prisma.role.upsert({
      where: { id: role.id },
      update: role,
      create: role,
    });
  });

  const results = await Promise.all(seeder);

  console.log('Role created or updated:', results);
}
