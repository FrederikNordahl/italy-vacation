import { prisma } from '../../utils/prisma'
import { createActivitySchema } from '../../utils/schemas'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = createActivitySchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.message })
  }

  const data = parsed.data
  const activity = await prisma.activity.create({
    data: {
      title: data.title,
      description: data.description ?? null,
      notes: data.notes ?? null,
      category: data.category,
      status: data.status ?? 'Idea',
      driveTimeMinutes: data.driveTimeMinutes ?? null,
      distanceKm: data.distanceKm ?? null,
      estimatedDurationHours: data.estimatedDurationHours ?? null,
      address: data.address ?? null,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : null,
      sortOrder: data.sortOrder ?? 0
    },
    include: {
      images: true,
      votes: true,
      _count: { select: { votes: true } }
    }
  })

  return activity
})
