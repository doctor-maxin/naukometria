import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  experimental: {
    externalTables: true,
  },
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env['DATABASE_URL'],
  },
  tables: {
    external: ['organizations', 'publications', 'persons', 'journals'],
  },
});
