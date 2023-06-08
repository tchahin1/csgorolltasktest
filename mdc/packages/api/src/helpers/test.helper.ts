import { apiConfig } from '@ankora/config';
import { PrismaClient } from '@prisma/client';

export const connectToTestDB = async () => {
  const dbUrl = apiConfig.dbConfig.dbUrl;
  const prisma = await new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
  });
  prisma.$connect;

  return prisma;
};
