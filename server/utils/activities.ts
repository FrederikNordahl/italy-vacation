import type { Activity, ActivityImage, Vote } from '@prisma/client'
import type { ActivityListItem } from '#shared/types/activity'
import { format } from 'date-fns'

type ActivityWithRelations = Activity & {
  images: ActivityImage[]
  votes: Vote[]
  _count: { votes: number }
}

export function computeVoteScore(votes: { value: number }[]): number {
  return votes.reduce((sum, v) => sum + v.value, 0)
}

export function countUpvotes(votes: { value: number }[]): number {
  return votes.filter(v => v.value === 1).length
}

export function countDownvotes(votes: { value: number }[]): number {
  return votes.filter(v => v.value === -1).length
}

export function formatScheduledDate(date: Date | null): string | null {
  if (!date) return null
  return format(date, 'yyyy-MM-dd')
}

export function serializeActivity(activity: ActivityWithRelations): ActivityListItem {
  const coverImage = activity.images.find(img => img.isCover) ?? activity.images[0] ?? null
  return {
    id: activity.id,
    title: activity.title,
    description: activity.description,
    notes: activity.notes,
    category: activity.category,
    status: activity.status,
    driveTimeMinutes: activity.driveTimeMinutes,
    distanceKm: activity.distanceKm,
    estimatedDurationHours: activity.estimatedDurationHours,
    address: activity.address,
    latitude: activity.latitude,
    longitude: activity.longitude,
    scheduledDate: formatScheduledDate(activity.scheduledDate),
    sortOrder: activity.sortOrder,
    aiSummary: activity.aiSummary,
    aiDescription: activity.aiDescription,
    aiTips: activity.aiTips,
    aiHighlights: activity.aiHighlights,
    createdAt: activity.createdAt.toISOString(),
    updatedAt: activity.updatedAt.toISOString(),
    images: activity.images.map(img => ({
      id: img.id,
      url: img.url,
      isCover: img.isCover,
      sortOrder: img.sortOrder
    })),
    coverImage: coverImage
      ? { id: coverImage.id, url: coverImage.url, isCover: coverImage.isCover, sortOrder: coverImage.sortOrder }
      : null,
    voteScore: computeVoteScore(activity.votes),
    upvotes: countUpvotes(activity.votes),
    downvotes: countDownvotes(activity.votes),
    votes: activity.votes.map(v => ({
      userName: v.userName,
      value: v.value
    })),
    _count: activity._count
  }
}

export function filterBySearch<T extends { title: string, description: string | null, category: string, address: string | null }>(
  items: T[],
  search?: string
): T[] {
  if (!search?.trim()) return items
  const q = search.toLowerCase()
  return items.filter(item =>
    item.title.toLowerCase().includes(q)
    || item.description?.toLowerCase().includes(q)
    || item.category.toLowerCase().includes(q)
    || item.address?.toLowerCase().includes(q)
  )
}

export function sortActivities(items: ActivityListItem[], sortBy?: string): ActivityListItem[] {
  const sorted = [...items]
  switch (sortBy) {
    case 'driveTime':
      return sorted.sort((a, b) => (a.driveTimeMinutes ?? 999) - (b.driveTimeMinutes ?? 999))
    case 'votes':
      return sorted.sort((a, b) => b.upvotes - a.upvotes || a.downvotes - b.downvotes)
    case 'category':
      return sorted.sort((a, b) => a.category.localeCompare(b.category))
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
    default:
      return sorted.sort((a, b) => a.sortOrder - b.sortOrder)
  }
}
