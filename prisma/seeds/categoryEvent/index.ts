import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categoryEvents = [
  {
    id: 1,
    name: 'Community Clean-Up',
    description: 'Volunteer to help clean up public spaces and local neighborhoods.',
  },
  {
    id: 2,
    name: 'Charity Fundraising',
    description: 'Participate in events that raise funds for local charities and causes.',
  },
  {
    id: 3,
    name: 'Environmental Conservation',
    description:
      'Contribute to tree planting, recycling programs, and environmental protection efforts.',
  },
  {
    id: 4,
    name: 'Youth Mentorship',
    description:
      'Help guide and mentor young people through educational and developmental programs.',
  },
  {
    id: 5,
    name: 'Disaster Relief Support',
    description:
      'Assist in emergency response and recovery efforts for communities affected by natural disasters.',
  },
];

export async function seedCategoryEvents() {
  const seeder = categoryEvents.map((categoryEvent) => {
    return prisma.categoryEvent.upsert({
      where: { id: categoryEvent.id },
      update: categoryEvent,
      create: categoryEvent,
    });
  });

  const results = await Promise.all(seeder);

  console.log('Category Event created or updated:', results);
}
