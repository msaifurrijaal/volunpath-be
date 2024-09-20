import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const educations = [
  {
    id: 1,
    name: 'High School',
    description: 'Completed secondary education with a focus on general studies.',
  },
  {
    id: 2,
    name: "Bachelor's Degree",
    description: 'Undergraduate degree focusing on specific academic discipline.',
  },
  {
    id: 3,
    name: "Master's Degree",
    description: 'Graduate-level degree with an emphasis on advanced specialization.',
  },
  {
    id: 4,
    name: 'Doctorate',
    description:
      'Highest academic degree with emphasis on original research or professional practice.',
  },
];

export async function seedEducations() {
  const seeder = educations.map((education) => {
    return prisma.education.upsert({
      where: { id: education.id },
      update: education,
      create: education,
    });
  });

  const results = await Promise.all(seeder);

  console.log('Educations created or updated:', results);
}
