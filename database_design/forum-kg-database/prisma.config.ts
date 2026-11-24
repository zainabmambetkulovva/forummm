// Prisma ORM v7: CLI operations use the direct Neon connection.
// For Prisma >= 7.10, a new project may use prisma7.config.ts instead;
// do not keep both config filenames in the same project.
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
