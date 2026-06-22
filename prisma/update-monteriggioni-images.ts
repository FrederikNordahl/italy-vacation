import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) })

const MONTERIGGIONI_IMAGES = [
  { url: '/images/activities/monteriggioni/aerial.png', isCover: true, sortOrder: 0 },
  { url: '/images/activities/monteriggioni/aerial-golden.png', isCover: false, sortOrder: 1 },
  { url: '/images/activities/monteriggioni/wall-walk.png', isCover: false, sortOrder: 2 },
  { url: '/images/activities/monteriggioni/piazza.png', isCover: false, sortOrder: 3 }
]

async function main() {
  const activity = await prisma.activity.findFirst({
    where: { title: 'Monteriggioni' }
  })

  if (!activity) {
    console.log('Ingen Monteriggioni-aktivitet fundet — kør db:seed først.')
    return
  }

  await prisma.activityImage.deleteMany({ where: { activityId: activity.id } })
  await prisma.activityImage.createMany({
    data: MONTERIGGIONI_IMAGES.map(img => ({ ...img, activityId: activity.id }))
  })

  console.log(`Opdaterede ${MONTERIGGIONI_IMAGES.length} billeder for Monteriggioni.`)
}

main()
  .catch(console.error)
  .finally(() => pool.end())
