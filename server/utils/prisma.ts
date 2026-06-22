import { resolve } from 'node:path'
import { config } from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function loadEnvFiles() {
  const root = process.cwd()
  config({ path: resolve(root, '.env.local') })
  config({ path: resolve(root, '.env') })
}

function resolveDatabaseUrl(): string {
  loadEnvFiles()

  const url =
    process.env.DATABASE_URL
    || process.env.POSTGRES_PRISMA_URL
    || process.env.POSTGRES_URL

  if (!url) {
    throw createError({
      statusCode: 500,
      statusMessage:
        'DATABASE_URL is not set. Run `vercel env pull .env.local` and restart the dev server.'
    })
  }

  return url
}

function createPrismaClient() {
  const pool = new pg.Pool({ connectionString: resolveDatabaseUrl() })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

function usePrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient()
  }
  return globalForPrisma.prisma
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = usePrismaClient()
    const value = Reflect.get(client, prop, client)
    return typeof value === 'function' ? value.bind(client) : value
  }
})
