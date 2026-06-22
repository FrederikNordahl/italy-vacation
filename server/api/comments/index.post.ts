import { prisma } from '../../utils/prisma'
import { createCommentSchema } from '../../utils/schemas'
import { toPrismaIdentity, toDisplayIdentity } from '../../utils/identity'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = createCommentSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.message })
  }

  const { activityId, userName, message } = parsed.data
  const prismaName = toPrismaIdentity(userName)

  const comment = await prisma.comment.create({
    data: { activityId, userName: prismaName, message }
  })

  return {
    id: comment.id,
    userName: comment.userName,
    displayName: toDisplayIdentity(comment.userName),
    message: comment.message,
    createdAt: comment.createdAt.toISOString()
  }
})
