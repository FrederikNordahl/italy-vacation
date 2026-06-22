import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) })

const BROLIO_IMAGES = [
  { url: '/images/activities/brolio/facade.png', isCover: true, sortOrder: 0 },
  { url: '/images/activities/brolio/landscape.png', isCover: false, sortOrder: 1 },
  { url: '/images/activities/brolio/aerial.png', isCover: false, sortOrder: 2 }
]

async function main() {
  const activity = await prisma.activity.findFirst({
    where: { title: 'Castello di Brolio' }
  })

  if (!activity) {
    console.log('Ingen Castello di Brolio-aktivitet fundet — kør db:seed først.')
    return
  }

  await prisma.activityImage.deleteMany({ where: { activityId: activity.id } })
  await prisma.activityImage.createMany({
    data: BROLIO_IMAGES.map(img => ({ ...img, activityId: activity.id }))
  })

  console.log(`Opdaterede ${BROLIO_IMAGES.length} billeder for Castello di Brolio.`)
}

main()
  .catch(console.error)
  .finally(() => pool.end())
