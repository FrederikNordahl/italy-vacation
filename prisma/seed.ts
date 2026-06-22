import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const identities = ['Anja', 'Per', 'Sarah', 'Frederik', 'Joan', 'Jane', 'Soren', 'Esther'] as const

async function main() {
  console.log('Seeder database...')

  for (const name of identities) {
    await prisma.userIdentity.upsert({
      where: { name },
      update: {},
      create: { name }
    })
  }

  await prisma.vote.deleteMany()
  await prisma.activityImage.deleteMany()
  await prisma.activityLink.deleteMany()
  await prisma.activity.deleteMany()

  const activities = [
    {
      title: 'Castello di Brolio',
      description: `## Et legendarisk Chianti-slot

**Castello di Brolio** har tilhørt familien Ricasoli siden 1141 og er et af verdens ældste vinerier. Slottet ligger på en bakketop i hjertet af Chianti Classico med fantastisk udsigt over vingårde og cypresser.

### Det kan I opleve
- Vinsmagning i historiske kældre
- Gåtur på middelalderlige volde og i haverne
- Køb Barone Ricasoli-vine og lokale produkter

En perfekt halvdagsudflugt med historie, udsigt og fremragende vin.`,
      notes: 'Book smagning på forhånd. Lukket nogle mandage.',
      category: 'Historic' as const,
      status: 'Idea' as const,
      driveTimeMinutes: 35,
      distanceKm: 25,
      estimatedDurationHours: 4,
      address: 'Località Madonna a Brolio, 53011 Gaiole in Chianti SI, Italien',
      latitude: 43.3933,
      longitude: 11.4372,
      scheduledDate: null,
      sortOrder: 0,
      images: [
        { url: '/images/activities/brolio/facade.png', isCover: true, sortOrder: 0 },
        { url: '/images/activities/brolio/landscape.png', isCover: false, sortOrder: 1 },
        { url: '/images/activities/brolio/aerial.png', isCover: false, sortOrder: 2 }
      ],
      links: [
        { title: 'Officiel hjemmeside', url: 'https://www.ricasoli.com/en/castello-di-brolio/', sortOrder: 0 },
        { title: 'Google Maps', url: 'https://maps.google.com/?q=Castello+di+Brolio', sortOrder: 1 }
      ]
    },
    {
      title: 'Siena + Palio',
      description: `## Middelalderlige Siena og Palio

**Siena** er en af Italiens smukkeste middelalderbyer. Den **2. juli 2026** afholdes den berømte **Palio di Siena** — et spektakulært hesteløb på Piazza del Campo.

### Højdepunkter
- Piazza del Campo — den skaldformede hovedplads
- Duomo di Siena — den sort-hvide marmorkatedral
- Contrada-kvarterer med faner og traditioner
- Palio-løbet ca. kl. 19.30 (kom tidligt!)

Planlæg en hel dag: udforsk byen om formiddagen, nyd en lang frokost, og oplev Palio-stemningen om eftermiddagen og aftenen.`,
      notes: 'Palio-dagen er MEGET travl. Parkér uden for bymuren. Book restaurant på forhånd.',
      category: 'Event' as const,
      status: 'Planned' as const,
      driveTimeMinutes: 50,
      distanceKm: 55,
      estimatedDurationHours: 8,
      address: 'Piazza del Campo, 53100 Siena SI, Italien',
      latitude: 43.3188,
      longitude: 11.3308,
      scheduledDate: new Date('2026-07-02'),
      sortOrder: 0,
      images: [
        { url: '/images/activities/siena/palio-race.png', isCover: true, sortOrder: 0 },
        { url: '/images/activities/siena/corteo.png', isCover: false, sortOrder: 1 },
        { url: '/images/activities/siena/duomo.png', isCover: false, sortOrder: 2 },
        { url: '/images/activities/siena/piazza-del-campo.png', isCover: false, sortOrder: 3 }
      ],
      links: [
        { title: 'Palio officielt', url: 'https://www.ilpalio.org/', sortOrder: 0 },
        { title: 'TripAdvisor Siena', url: 'https://www.tripadvisor.com/Tourism-g187902-Siena_Province_of_Siena_Tuscany-Vacations.html', sortOrder: 1 },
        { title: 'Google Maps', url: 'https://maps.google.com/?q=Piazza+del+Campo+Siena', sortOrder: 2 }
      ]
    },
    {
      title: 'Monteriggioni',
      description: `## Den befæstede middelalderby

**Monteriggioni** er en perfekt bevaret middelalderby med ringmur — et af Toscanas mest ikoniske steder. Dante nævnte tårnene i *Den guddommelige komedie*.

Gå hele vejen rundt på muren, udforsk den lille piazza, og spis frokost på en trattoria inden for murene. Lille nok til 2–3 timer, men utroligt stemningsfuld.`,
      notes: 'Lille parkeringsplads uden for muren. Turistet, men det er det værd.',
      category: 'Sightseeing' as const,
      status: 'Idea' as const,
      driveTimeMinutes: 55,
      distanceKm: 50,
      estimatedDurationHours: 3,
      address: '53035 Monteriggioni SI, Italien',
      latitude: 43.3903,
      longitude: 11.2225,
      scheduledDate: null,
      sortOrder: 1,
      images: [
        { url: '/images/activities/monteriggioni/aerial.png', isCover: true, sortOrder: 0 },
        { url: '/images/activities/monteriggioni/aerial-golden.png', isCover: false, sortOrder: 1 },
        { url: '/images/activities/monteriggioni/wall-walk.png', isCover: false, sortOrder: 2 },
        { url: '/images/activities/monteriggioni/piazza.png', isCover: false, sortOrder: 3 }
      ],
      links: [
        { title: 'Visit Tuscany', url: 'https://www.visittuscany.com/en/ideas/monteriggioni/', sortOrder: 0 },
        { title: 'Google Maps', url: 'https://maps.google.com/?q=Monteriggioni', sortOrder: 1 }
      ]
    },
    {
      title: 'Fattoria Santa Vittoria',
      description: `## Fra jord til bord i Chianti-bakkerne

**Fattoria Santa Vittoria** er en familiedrevet økologisk gård med vinsmagning, olivenolie og en fantastisk agriturismo-restaurant blandt bakker og vingårde.

Nyd en langsom frokost med lokale vine, gå en tur på gården, og køb økologiske produkter med hjem.`,
      notes: 'Frokostreservation anbefales. Børn er velkomne.',
      category: 'Wine' as const,
      status: 'Planned' as const,
      driveTimeMinutes: 55,
      distanceKm: 45,
      estimatedDurationHours: 5,
      address: 'Località Santa Vittoria, 53017 Radda in Chianti SI, Italien',
      latitude: 43.4833,
      longitude: 11.3667,
      scheduledDate: null,
      sortOrder: 2,
      images: [
        { url: '/images/activities/vittoria/estate-aerial.png', isCover: true, sortOrder: 0 },
        { url: '/images/activities/vittoria/cellar.png', isCover: false, sortOrder: 1 },
        { url: '/images/activities/vittoria/tasting.png', isCover: false, sortOrder: 2 },
        { url: '/images/activities/vittoria/truffle.png', isCover: false, sortOrder: 3 }
      ],
      links: [
        { title: 'Google Maps', url: 'https://maps.google.com/?q=Fattoria+Santa+Vittoria+Chianti', sortOrder: 0 }
      ]
    },
    {
      title: "Alta Val d'Elsa + Diborrato-vandfald",
      description: `## Flodbade og vandfald

Køl af i den toscanske hede med en dag i **Alta Val d'Elsa** — flodbadepladser, naturstier og det smukke **Diborrato-vandfald**.

### Højdepunkter
- Naturlige badehuller i Elsa-floden
- Kort vandring til vandfaldet
- Skyggefulde picnicsteder langs stien
- Perfekt på varme sommerdage

Husk badetøj, vandsko og picnic. En forfriskende pause fra vin og sightseeing.`,
      notes: 'Tjek vandstand inden afsted. Sten kan være glatte ved vandfaldet.',
      category: 'Swimming' as const,
      status: 'Idea' as const,
      driveTimeMinutes: 60,
      distanceKm: 65,
      estimatedDurationHours: 5,
      address: 'Val d\'Elsa, Toscana, Italien',
      latitude: 43.4678,
      longitude: 11.0432,
      scheduledDate: null,
      sortOrder: 3,
      images: [
        { url: '/images/activities/elsa/turquoise-pool.png', isCover: true, sortOrder: 0 },
        { url: '/images/activities/elsa/waterfall-pool.png', isCover: false, sortOrder: 1 },
        { url: '/images/activities/elsa/river-crossing.png', isCover: false, sortOrder: 2 },
        { url: '/images/activities/elsa/swimming-hole.png', isCover: false, sortOrder: 3 }
      ],
      links: [
        { title: 'Google Maps', url: 'https://maps.google.com/?q=Parco+fluviale+Alta+Val+d%27Elsa', sortOrder: 0 }
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

  console.log(`Seedede ${createdActivities.length} aktiviteter.`)
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
