import { prisma } from '../../utils/prisma'
import { createVoteSchema } from '../../utils/schemas'
import { toPrismaIdentity } from '../../utils/identity'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = createVoteSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.message })
  }

  const { activityId, userName, value } = parsed.data
  const prismaName = toPrismaIdentity(userName)

  const vote = await prisma.vote.upsert({
    where: {
      activityId_userName: { activityId, userName: prismaName }
    },
    update: { value },
    create: { activityId, userName: prismaName, value }
  })

  return vote
})
