import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const skills = [
  {
    id: 1,
    name: 'Communication',
    description: 'Effective communication skills to help in team collaboration and outreach.',
  },
  {
    id: 2,
    name: 'Teamwork',
    description: 'Ability to work effectively in a group setting to achieve goals.',
  },
  {
    id: 3,
    name: 'Problem Solving',
    description: 'Analytical thinking and creativity to solve problems efficiently.',
  },
  {
    id: 4,
    name: 'Leadership',
    description: 'Capable of leading a team or project and ensuring tasks are completed.',
  },
  {
    id: 5,
    name: 'Time Management',
    description: 'Managing time effectively to ensure tasks and goals are met in a timely manner.',
  },
];

export async function seedSkills() {
  const seeder = skills.map((skill) => {
    return prisma.skill.upsert({
      where: { id: skill.id },
      update: skill,
      create: skill,
    });
  });

  const results = await Promise.all(seeder);

  console.log('Skills created or updated:', results);
}
