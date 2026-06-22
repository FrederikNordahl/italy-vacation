import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = await getQuery(event)
  const activityId = query.activityId as string
  if (!activityId) {
    throw createError({ statusCode: 400, statusMessage: 'activityId required' })
  }

  return prisma.activityLink.findMany({
    where: { activityId },
    orderBy: { sortOrder: 'asc' }
  })
})
