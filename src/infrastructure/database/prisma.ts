import fp from 'fastify-plugin';
import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prismaPlugin = fp(async (app) => {
  const adapter = new PrismaPg({ connectionString: app.config.DATABASE_URL });

  const prisma = new PrismaClient({ adapter });

  app.addHook('onClose', async () => {
    await prisma.$disconnect();
  });

  app.decorate('prisma', prisma);
  app.log.info('Database successfuly connected');
});

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

export default prismaPlugin;
