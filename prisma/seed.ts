import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const identities = ['Frederik', 'Soren', 'Marie', 'Peter', 'Anna', 'Lars', 'Emma', 'Jonas'] as const

async function main() {
  console.log('Seeding database...')

  for (const name of identities) {
    await prisma.userIdentity.upsert({
      where: { name },
      update: {},
      create: { name }
    })
  }

  await prisma.comment.deleteMany()
  await prisma.vote.deleteMany()
  await prisma.activityImage.deleteMany()
  await prisma.activityLink.deleteMany()
  await prisma.activity.deleteMany()

  const activities = [
    {
      title: 'Castello di Brolio',
      description: `## A legendary Chianti castle

The **Castello di Brolio** has been owned by the Ricasoli family since 1141, making it one of the oldest wineries in the world. Perched on a hilltop in the heart of Chianti Classico, the castle offers sweeping views of vineyards and cypress-lined roads.

### What to expect
- Guided wine tastings in historic cellars
- Walk through medieval ramparts and gardens
- Shop for Barone Ricasoli wines and local products

A perfect half-day trip combining history, scenery, and world-class wine.`,
      notes: 'Book tasting in advance. Closed some Mondays.',
      category: 'Wine' as const,
      status: 'Idea' as const,
      driveTimeMinutes: 35,
      distanceKm: 25,
      estimatedDurationHours: 3,
      address: 'Località Madonna a Brolio, 53011 Gaiole in Chianti SI, Italy',
      latitude: 43.3933,
      longitude: 11.4372,
      scheduledDate: null,
      sortOrder: 0,
      images: [
        { url: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800', isCover: true, sortOrder: 0 },
        { url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800', isCover: false, sortOrder: 1 }
      ],
      links: [
        { title: 'Official Website', url: 'https://www.ricasoli.com/en/castello-di-brolio/', sortOrder: 0 },
        { title: 'Google Maps', url: 'https://maps.google.com/?q=Castello+di+Brolio', sortOrder: 1 }
      ]
    },
    {
      title: 'Siena + Palio',
      description: `## Medieval Siena and the Palio

**Siena** is one of Italy's most beautiful medieval cities. On **July 2, 2026**, the city hosts the famous **Palio di Siena** — a thrilling bareback horse race in the Piazza del Campo.

### Highlights
- Piazza del Campo — the shell-shaped main square
- Duomo di Siena — stunning black-and-white marble cathedral
- Contrada neighborhoods with flags and traditions
- Palio race at ~7:30 PM (arrive early for a spot!)

Plan a full day: explore the city in the morning, enjoy a long lunch, then experience the Palio atmosphere in the afternoon and evening.`,
      notes: 'Palio day is VERY crowded. Park outside city walls. Book restaurant ahead.',
      category: 'Event' as const,
      status: 'Planned' as const,
      driveTimeMinutes: 50,
      distanceKm: 55,
      estimatedDurationHours: 8,
      address: 'Piazza del Campo, 53100 Siena SI, Italy',
      latitude: 43.3188,
      longitude: 11.3308,
      scheduledDate: new Date('2026-07-02'),
      sortOrder: 0,
      images: [
        { url: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800', isCover: true, sortOrder: 0 },
        { url: 'https://images.unsplash.com/photo-1552837165-4a3f2d5e4c2e?w=800', isCover: false, sortOrder: 1 },
        { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Palio_di_Siena.jpg/800px-Palio_di_Siena.jpg', isCover: false, sortOrder: 2 }
      ],
      links: [
        { title: 'Palio Official', url: 'https://www.ilpalio.org/', sortOrder: 0 },
        { title: 'TripAdvisor Siena', url: 'https://www.tripadvisor.com/Tourism-g187902-Siena_Province_of_Siena_Tuscany-Vacations.html', sortOrder: 1 },
        { title: 'Google Maps', url: 'https://maps.google.com/?q=Piazza+del+Campo+Siena', sortOrder: 2 }
      ]
    },
    {
      title: 'Monteriggioni',
      description: `## The walled fortress town

**Monteriggioni** is a perfectly preserved medieval walled town — one of the most iconic sights in Tuscany. Dante mentioned its towers in the *Divine Comedy*.

Walk the complete ring of walls, explore the tiny piazza, and enjoy lunch at a trattoria inside the walls. Small enough to see in 2–3 hours but incredibly atmospheric.`,
      notes: 'Small parking lot outside walls. Very touristy but worth it.',
      category: 'History' as const,
      status: 'Idea' as const,
      driveTimeMinutes: 55,
      distanceKm: 50,
      estimatedDurationHours: 3,
      address: '53035 Monteriggioni SI, Italy',
      latitude: 43.3903,
      longitude: 11.2225,
      scheduledDate: null,
      sortOrder: 1,
      images: [
        { url: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65cd05?w=800', isCover: true, sortOrder: 0 },
        { url: 'https://images.unsplash.com/photo-1499856871951-2ade09165d7e?w=800', isCover: false, sortOrder: 1 }
      ],
      links: [
        { title: 'Visit Tuscany', url: 'https://www.visittuscany.com/en/ideas/monteriggioni/', sortOrder: 0 },
        { title: 'Google Maps', url: 'https://maps.google.com/?q=Monteriggioni', sortOrder: 1 }
      ]
    },
    {
      title: 'Fattoria Santa Vittoria',
      description: `## Farm-to-table in the Chianti hills

**Fattoria Santa Vittoria** is a family-run organic farm offering wine tastings, olive oil, and a wonderful agriturismo restaurant. Set among rolling hills and vineyards.

Enjoy a leisurely lunch with local wines, tour the farm, and pick up organic products to bring home.`,
      notes: 'Lunch reservation recommended. Kids welcome.',
      category: 'Food' as const,
      status: 'Idea' as const,
      driveTimeMinutes: 55,
      distanceKm: 45,
      estimatedDurationHours: 4,
      address: 'Località Santa Vittoria, 53017 Radda in Chianti SI, Italy',
      latitude: 43.4833,
      longitude: 11.3667,
      scheduledDate: null,
      sortOrder: 2,
      images: [
        { url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', isCover: true, sortOrder: 0 },
        { url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800', isCover: false, sortOrder: 1 }
      ],
      links: [
        { title: 'Google Maps', url: 'https://maps.google.com/?q=Fattoria+Santa+Vittoria+Chianti', sortOrder: 0 }
      ]
    },
    {
      title: "Alta Val d'Elsa",
      description: `## Scenic valley drive and hill towns

Explore the **upper Elsa Valley** — a less-touristed area with charming hill towns like **San Gimignano** (famous for its medieval towers) and beautiful countryside drives.

### Suggested route
1. Drive through the Val d'Elsa
2. Stop in San Gimignano for gelato and tower views
3. Optional: Colle Val d'Elsa for artisan shops

A relaxed day of driving, walking, and discovering hidden Tuscany.`,
      notes: 'San Gimignano gets busy midday — arrive early or late.',
      category: 'Nature' as const,
      status: 'Idea' as const,
      driveTimeMinutes: 60,
      distanceKm: 65,
      estimatedDurationHours: 6,
      address: 'San Gimignano, 53037 SI, Italy',
      latitude: 43.4678,
      longitude: 11.0432,
      scheduledDate: null,
      sortOrder: 3,
      images: [
        { url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800', isCover: true, sortOrder: 0 },
        { url: 'https://images.unsplash.com/photo-1467269209334-ee000dd34961?w=800', isCover: false, sortOrder: 1 },
        { url: 'https://images.unsplash.com/photo-1499856871951-2ade09165d7e?w=800', isCover: false, sortOrder: 2 }
      ],
      links: [
        { title: 'San Gimignano Tourism', url: 'https://www.sangimignano.com/', sortOrder: 0 },
        { title: 'Google Maps', url: 'https://maps.google.com/?q=San+Gimignano', sortOrder: 1 }
      ]
    }
  ]

  const createdActivities = []
  for (const activity of activities) {
    const { images, links, ...data } = activity
    const created = await prisma.activity.create({
      data: {
        ...data,
        images: { create: images },
        links: { create: links }
      }
    })
    createdActivities.push(created)
  }

  const siena = createdActivities[1]
  const brolio = createdActivities[0]
  const monteriggioni = createdActivities[2]

  const votes = [
    { activityId: siena.id, userName: 'Frederik' as const, value: 1 },
    { activityId: siena.id, userName: 'Soren' as const, value: 1 },
    { activityId: siena.id, userName: 'Marie' as const, value: 1 },
    { activityId: siena.id, userName: 'Peter' as const, value: 1 },
    { activityId: siena.id, userName: 'Anna' as const, value: -1 },
    { activityId: brolio.id, userName: 'Frederik' as const, value: 1 },
    { activityId: brolio.id, userName: 'Lars' as const, value: 1 },
    { activityId: brolio.id, userName: 'Emma' as const, value: 1 },
    { activityId: monteriggioni.id, userName: 'Jonas' as const, value: 1 },
    { activityId: monteriggioni.id, userName: 'Marie' as const, value: 1 },
    { activityId: monteriggioni.id, userName: 'Peter' as const, value: -1 }
  ]

  for (const vote of votes) {
    await prisma.vote.create({ data: vote })
  }

  const comments = [
    { activityId: siena.id, userName: 'Frederik' as const, message: 'This is THE highlight of the trip — we have to go!' },
    { activityId: siena.id, userName: 'Soren' as const, message: 'Remember how crowded it was last time? Still worth it for the Palio.' },
    { activityId: siena.id, userName: 'Anna' as const, message: 'I am worried about crowds with kids. Maybe we split the group?' },
    { activityId: brolio.id, userName: 'Emma' as const, message: 'The wine tasting here was amazing when I visited in 2019.' },
    { activityId: monteriggioni.id, userName: 'Lars' as const, message: 'Quick stop — great for photos and a coffee.' },
    { activityId: createdActivities[3].id, userName: 'Peter' as const, message: 'The farm lunch looks incredible. Can we book for 6?' }
  ]

  for (const comment of comments) {
    await prisma.comment.create({ data: comment })
  }

  console.log(`Seeded ${createdActivities.length} activities with votes and comments.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
