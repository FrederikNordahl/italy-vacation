import { put } from '@vercel/blob'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)
  if (!formData) {
    throw createError({ statusCode: 400, statusMessage: 'Expected multipart form data' })
  }

  let activityId = ''
  let isCover = false
  let file: { data: Buffer, filename?: string, type?: string } | null = null

  for (const part of formData) {
    if (part.name === 'activityId' && part.data) {
      activityId = part.data.toString()
    } else if (part.name === 'isCover' && part.data) {
      isCover = part.data.toString() === 'true'
    } else if (part.name === 'file' && part.data) {
      file = { data: part.data, filename: part.filename, type: part.type }
    }
  }

  if (!activityId || !file) {
    throw createError({ statusCode: 400, statusMessage: 'activityId and file required' })
  }

  const maxSize = 4.5 * 1024 * 1024
  if (file.data.length > maxSize) {
    throw createError({ statusCode: 400, statusMessage: 'File exceeds 4.5MB limit' })
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    throw createError({ statusCode: 500, statusMessage: 'BLOB_READ_WRITE_TOKEN not configured' })
  }

  const filename = file.filename ?? `activity-${activityId}-${Date.now()}.jpg`
  const blob = await put(`activities/${activityId}/${filename}`, file.data, {
    access: 'public',
    token,
    contentType: file.type ?? 'image/jpeg'
  })

  if (isCover) {
    await prisma.activityImage.updateMany({
      where: { activityId },
      data: { isCover: false }
    })
  }

  const imageCount = await prisma.activityImage.count({ where: { activityId } })

  const image = await prisma.activityImage.create({
    data: {
      activityId,
      url: blob.url,
      isCover: isCover || imageCount === 0,
      sortOrder: imageCount
    }
  })

  return image
})
