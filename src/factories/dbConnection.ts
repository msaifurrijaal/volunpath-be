import { PrismaClient } from '@prisma/client';
import config from '../config';
import { exit } from 'process';

const dbConnection = async () => {
  const { mode } = config;
  const prisma = new PrismaClient({
    log: mode === 'dev' ? ['query', 'error'] : undefined,
  });

  try {
    console.log('Connecting to database...');
    await prisma.$queryRaw`SELECT 1`;
    console.log('Connected to database');
    return prisma;
  } catch (error) {
    console.error(error);
    exit(1);
  }
};

export default dbConnection;
