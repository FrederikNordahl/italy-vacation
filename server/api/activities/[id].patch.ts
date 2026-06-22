import { prisma } from '../../utils/prisma'
import { updateActivitySchema } from '../../utils/schemas'
import { serializeActivity } from '../../utils/activities'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing activity id' })
  }

  const body = await readBody(event)
  const parsed = updateActivitySchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.message })
  }

  const { batchUpdates, ...data } = parsed.data

  if (batchUpdates?.length) {
    await prisma.$transaction(
      batchUpdates.map(update =>
        prisma.activity.update({
          where: { id: update.id },
          data: {
            scheduledDate: update.scheduledDate === undefined
              ? undefined
              : update.scheduledDate
                ? new Date(update.scheduledDate)
                : null,
            sortOrder: update.sortOrder
          }
        })
      )
    )

    const activities = await prisma.activity.findMany({
      where: { id: { in: batchUpdates.map(u => u.id) } },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        votes: true,
        _count: { select: { votes: true } }
      }
    })

    return activities.map(serializeActivity)
  }

  const updateData: Record<string, unknown> = { ...data }
  if (data.scheduledDate !== undefined) {
    updateData.scheduledDate = data.scheduledDate ? new Date(data.scheduledDate) : null
  }

  const activity = await prisma.activity.update({
    where: { id },
    data: updateData,
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      links: { orderBy: { sortOrder: 'asc' } },
      votes: true,
      _count: { select: { votes: true } }
    }
  })

  return {
    ...serializeActivity(activity),
    links: activity.links,
    votes: activity.votes
  }
})
