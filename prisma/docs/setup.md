# Prisma + Neon PostgreSQL Setup Guide

## Prerequisites

- Node.js >= 20.0.0
- pnpm >= 8.0.0
- Neon account (https://console.neon.tech/)

## Step 1: Create Neon Database

1. Go to https://console.neon.tech/
2. Create a new project named `forum-kg`
3. Select region closest to your users (e.g., AWS Frankfurt for Kyrgyzstan)
4. Copy the connection strings:
   - **Pooled connection** (for runtime)
   - **Direct connection** (for migrations)

## Step 2: Configure Environment Variables

Create `.env` file in the `prisma` directory:

```bash
cp prisma/.env.example prisma/.env
```

Edit `prisma/.env` and add your Neon connection strings:

```env
DATABASE_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech/forum_kg?sslmode=require&connection_limit=10&pool_timeout=0"
DIRECT_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech/forum_kg?sslmode=require"
```

⚠️ **Important**: Never commit `.env` files to git!

## Step 3: Install Dependencies

From the root directory:

```bash
pnpm install
```

## Step 4: Generate Prisma Client

```bash
pnpm db:generate
```

This generates TypeScript types based on your schema.

## Step 5: Run Migrations

### Development (with migration files)

```bash
pnpm db:migrate
```

This will:
- Create migration files in `prisma/migrations/`
- Apply migrations to your Neon database
- Regenerate Prisma Client

### Production (apply existing migrations)

```bash
pnpm db:migrate:deploy
```

## Step 6: Seed Database (Optional)

Populate database with sample data:

```bash
pnpm db:seed
```

This creates:
- Admin user (phone: +996700000000)
- Test user (phone: +996700000001)
- Site settings
- Sample forum with ticket categories
- Integration health records

## Available Commands

| Command | Description |
|---------|-------------|
| `pnpm db:generate` | Generate Prisma Client |
| `pnpm db:push` | Push schema to database (dev only, skips migrations) |
| `pnpm db:migrate` | Create and apply migration |
| `pnpm db:migrate:deploy` | Apply migrations in production |
| `pnpm db:seed` | Seed database with sample data |
| `pnpm db:studio` | Open Prisma Studio (database GUI) |
| `pnpm db:reset` | Reset database (⚠️ deletes all data) |

## Prisma Studio

View and edit your database with a GUI:

```bash
pnpm db:studio
```

Opens at: http://localhost:5555

## Connection Configuration

### Pooled Connection (Runtime)

Used by your NestJS application:

```
postgresql://user:pass@host/db?sslmode=require&connection_limit=10&pool_timeout=0
```

- `connection_limit=10`: Max connections per instance
- `pool_timeout=0`: Wait indefinitely for connection

### Direct Connection (Migrations)

Used by Prisma CLI:

```
postgresql://user:pass@host/db?sslmode=require
```

## Neon-Specific Considerations

### Serverless Architecture

Neon uses serverless PostgreSQL, which means:
- Connections are pooled automatically
- Database scales to zero when inactive
- Cold starts may add ~100-500ms latency

### Connection Pooling

For production, consider using:
- **Neon's built-in pooler** (recommended)
- **PgBouncer** for additional pooling
- **Prisma Data Proxy** for serverless environments

### Best Practices

1. **Use pooled connections** in your app
2. **Use direct connections** for migrations
3. **Close connections properly** (`$disconnect()`)
4. **Handle connection errors** (retry logic)
5. **Monitor connection usage** in Neon dashboard

## Troubleshooting

### "Too many connections"

- Reduce `connection_limit` in DATABASE_URL
- Use Neon's connection pooler
- Ensure proper connection cleanup

### "Migration failed"

- Check DIRECT_URL is set correctly
- Verify database user has CREATE privileges
- Review migration SQL for errors

### "Cannot find module '@prisma/client'"

```bash
pnpm db:generate
```

### Schema changes not reflected

```bash
pnpm db:generate
# Restart your dev server
```

## Production Deployment

1. Set environment variables on your server
2. Run migrations: `pnpm db:migrate:deploy`
3. Generate client: `pnpm db:generate`
4. Start application

**Never use `db:push` or `db:migrate` in production!**

## Schema Changes Workflow

1. Modify `prisma/schema.prisma`
2. Create migration: `pnpm db:migrate`
3. Review generated SQL in `prisma/migrations/`
4. Test migration locally
5. Commit migration files to git
6. Deploy: `pnpm db:migrate:deploy`

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Prisma + Neon Guide](https://www.prisma.io/docs/guides/database/neon)
