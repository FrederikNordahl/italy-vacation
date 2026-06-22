import { prisma } from '../../utils/prisma'
import { createLinkSchema } from '../../utils/schemas'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = createLinkSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.message })
  }

  const { activityId, title, url, sortOrder } = parsed.data

  return prisma.activityLink.create({
    data: {
      activityId,
      title,
      url,
      sortOrder: sortOrder ?? 0
    }
  })
})
