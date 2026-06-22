import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) })

const SIENA_IMAGES = [
  { url: '/images/activities/siena/palio-race.png', isCover: true, sortOrder: 0 },
  { url: '/images/activities/siena/corteo.png', isCover: false, sortOrder: 1 },
  { url: '/images/activities/siena/duomo.png', isCover: false, sortOrder: 2 },
  { url: '/images/activities/siena/piazza-del-campo.png', isCover: false, sortOrder: 3 }
]

async function main() {
  const activity = await prisma.activity.findFirst({
    where: { title: 'Siena + Palio' }
  })

  if (!activity) {
    console.log('Ingen Siena + Palio-aktivitet fundet — kør db:seed først.')
    return
  }

  await prisma.activityImage.deleteMany({ where: { activityId: activity.id } })
  await prisma.activityImage.createMany({
    data: SIENA_IMAGES.map(img => ({ ...img, activityId: activity.id }))
  })

  console.log(`Opdaterede ${SIENA_IMAGES.length} billeder for Siena + Palio.`)
}

main()
  .catch(console.error)
  .finally(() => pool.end())
