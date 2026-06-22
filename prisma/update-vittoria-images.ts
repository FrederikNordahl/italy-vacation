import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) })

const VITTORIA_IMAGES = [
  { url: '/images/activities/vittoria/estate-aerial.png', isCover: true, sortOrder: 0 },
  { url: '/images/activities/vittoria/cellar.png', isCover: false, sortOrder: 1 },
  { url: '/images/activities/vittoria/tasting.png', isCover: false, sortOrder: 2 },
  { url: '/images/activities/vittoria/truffle.png', isCover: false, sortOrder: 3 }
]

async function main() {
  const activity = await prisma.activity.findFirst({
    where: { title: 'Fattoria Santa Vittoria' }
  })

  if (!activity) {
    console.log('Ingen Fattoria Santa Vittoria-aktivitet fundet — kør db:seed først.')
    return
  }

  await prisma.activityImage.deleteMany({ where: { activityId: activity.id } })
  await prisma.activityImage.createMany({
    data: VITTORIA_IMAGES.map(img => ({ ...img, activityId: activity.id }))
  })

  console.log(`Opdaterede ${VITTORIA_IMAGES.length} billeder for Fattoria Santa Vittoria.`)
}

main()
  .catch(console.error)
  .finally(() => pool.end())
