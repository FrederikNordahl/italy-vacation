import { z } from 'zod'

const activityCategoryEnum = z.enum([
  'Culture', 'Food', 'Wine', 'Nature', 'History',
  'Shopping', 'Adventure', 'Relaxation', 'Event'
])

const activityStatusEnum = z.enum(['Idea', 'Planned', 'Booked', 'Completed'])

const identityEnum = z.enum([
  'Frederik', 'Søren', 'Soren', 'Marie', 'Peter', 'Anna', 'Lars', 'Emma', 'Jonas'
])

export const createActivitySchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  category: activityCategoryEnum,
  status: activityStatusEnum.optional(),
  driveTimeMinutes: z.number().int().min(0).optional().nullable(),
  distanceKm: z.number().min(0).optional().nullable(),
  estimatedDurationHours: z.number().min(0).optional().nullable(),
  address: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  scheduledDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  sortOrder: z.number().int().optional()
})

export const updateActivitySchema = createActivitySchema.partial().extend({
  sortOrder: z.number().int().optional(),
  batchUpdates: z.array(z.object({
    id: z.string(),
    scheduledDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
    sortOrder: z.number().int()
  })).optional()
})

export const createVoteSchema = z.object({
  activityId: z.string(),
  userName: identityEnum,
  value: z.union([z.literal(1), z.literal(-1)])
})

export const createCommentSchema = z.object({
  activityId: z.string(),
  userName: identityEnum,
  message: z.string().min(1).max(2000)
})

export const createLinkSchema = z.object({
  activityId: z.string(),
  title: z.string().min(1).max(200),
  url: z.string().url(),
  sortOrder: z.number().int().optional()
})

export const activityQuerySchema = z.object({
  search: z.string().optional(),
  category: activityCategoryEnum.optional(),
  maxDriveMinutes: z.coerce.number().int().optional(),
  sortBy: z.enum(['driveTime', 'votes', 'category', 'title']).optional()
})
