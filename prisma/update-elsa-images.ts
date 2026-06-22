import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) })

const ELSA_IMAGES = [
  { url: '/images/activities/elsa/turquoise-pool.png', isCover: true, sortOrder: 0 },
  { url: '/images/activities/elsa/waterfall-pool.png', isCover: false, sortOrder: 1 },
  { url: '/images/activities/elsa/river-crossing.png', isCover: false, sortOrder: 2 },
  { url: '/images/activities/elsa/swimming-hole.png', isCover: false, sortOrder: 3 }
]

async function main() {
  const activity = await prisma.activity.findFirst({
    where: { title: "Alta Val d'Elsa + Diborrato-vandfald" }
  })

  if (!activity) {
    console.log('Ingen Elsa-aktivitet fundet — kør db:seed først.')
    return
  }

  await prisma.activityImage.deleteMany({ where: { activityId: activity.id } })
  await prisma.activityImage.createMany({
    data: ELSA_IMAGES.map(img => ({ ...img, activityId: activity.id }))
  })

  console.log(`Opdaterede ${ELSA_IMAGES.length} billeder for Alta Val d'Elsa.`)
}

main()
  .catch(console.error)
  .finally(() => pool.end())
