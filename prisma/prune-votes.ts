import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) })

async function main() {
  const result = await prisma.vote.deleteMany()
  console.log(`Slettede ${result.count} stemmer.`)
}

main()
  .catch(console.error)
  .finally(() => pool.end())
