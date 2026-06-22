import { prisma } from '../../utils/prisma'
import { serializeActivity, computeVoteScore } from '../../utils/activities'
import { toDisplayIdentity } from '../../utils/identity'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing activity id' })
  }

  const activity = await prisma.activity.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      links: { orderBy: { sortOrder: 'asc' } },
      votes: true,
      _count: { select: { votes: true } }
    }
  })

  if (!activity) {
    throw createError({ statusCode: 404, statusMessage: 'Activity not found' })
  }

  const base = serializeActivity({
    ...activity,
    _count: { votes: activity._count.votes }
  })

  return {
    ...base,
    links: activity.links,
    votes: activity.votes.map(v => ({
      id: v.id,
      userName: v.userName,
      displayName: toDisplayIdentity(v.userName),
      value: v.value
    })),
    voteScore: computeVoteScore(activity.votes)
  }
})
