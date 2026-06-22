import { prisma } from '../../utils/prisma'
import { activityQuerySchema } from '../../utils/schemas'
import { filterBySearch, serializeActivity, sortActivities } from '../../utils/activities'

export default defineEventHandler(async (event) => {
  const query = await getQuery(event)
  const parsed = activityQuerySchema.safeParse(query)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.message })
  }

  const { search, category, maxDriveMinutes, sortBy } = parsed.data

  const activities = await prisma.activity.findMany({
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      votes: true,
      _count: { select: { comments: true, votes: true } }
    },
    orderBy: [{ scheduledDate: 'asc' }, { sortOrder: 'asc' }]
  })

  let filtered = activities

  if (category) {
    filtered = filtered.filter(a => a.category === category)
  }

  if (maxDriveMinutes !== undefined) {
    filtered = filtered.filter(a =>
      a.driveTimeMinutes !== null && a.driveTimeMinutes <= maxDriveMinutes
    )
  }

  let serialized = filtered.map(serializeActivity)
  serialized = filterBySearch(serialized, search)
  serialized = sortActivities(serialized, sortBy)

  return serialized
})
