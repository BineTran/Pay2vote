import { PrismaClient } from '@prisma/client';
import { logger } from '@/utils/logger';

// Initialize a prisma instance
const prisma = new PrismaClient();
logger.info('Prisma instance created!');

export default prisma;
