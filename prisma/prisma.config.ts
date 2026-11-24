import { defineConfig } from 'prisma/config';

export default defineConfig({
  datasource: {
    database: 'postgresql',
  },
  generator: {
    provider: 'prisma-client-js',
    output: '../apps/api/node_modules/@prisma/client',
  },
});
