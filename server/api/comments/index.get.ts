import { prisma } from '../../utils/prisma'
import { toDisplayIdentity } from '../../utils/identity'

export default defineEventHandler(async (event) => {
  const query = await getQuery(event)
  const activityId = query.activityId as string
  if (!activityId) {
    throw createError({ statusCode: 400, statusMessage: 'activityId required' })
  }

  const comments = await prisma.comment.findMany({
    where: { activityId },
    orderBy: { createdAt: 'asc' }
  })

  return comments.map(c => ({
    id: c.id,
    userName: c.userName,
    displayName: toDisplayIdentity(c.userName),
    message: c.message,
    createdAt: c.createdAt.toISOString()
  }))
})
