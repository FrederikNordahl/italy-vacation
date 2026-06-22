import { prisma } from '../../utils/prisma'
import { toDisplayIdentity } from '../../utils/identity'

export default defineEventHandler(async (event) => {
  const query = await getQuery(event)
  const activityId = query.activityId as string
  if (!activityId) {
    throw createError({ statusCode: 400, statusMessage: 'activityId required' })
  }

  const votes = await prisma.vote.findMany({
    where: { activityId },
    orderBy: { createdAt: 'asc' }
  })

  return votes.map(v => ({
    id: v.id,
    userName: v.userName,
    displayName: toDisplayIdentity(v.userName),
    value: v.value
  }))
})
