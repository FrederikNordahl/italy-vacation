import type { ActivityCategory, ActivityStatus, UserIdentityName } from '@prisma/client'

export interface ActivityImageDto {
  id: string
  url: string
  isCover: boolean
  sortOrder: number
}

export interface ActivityLinkDto {
  id: string
  title: string
  url: string
  sortOrder: number
}

export interface VoteDto {
  id: string
  userName: UserIdentityName
  value: number
}

export interface CommentDto {
  id: string
  userName: UserIdentityName
  message: string
  createdAt: string
}

export interface ActivityDto {
  id: string
  title: string
  description: string | null
  notes: string | null
  category: ActivityCategory
  status: ActivityStatus
  driveTimeMinutes: number | null
  distanceKm: number | null
  estimatedDurationHours: number | null
  address: string | null
  latitude: number | null
  longitude: number | null
  scheduledDate: string | null
  sortOrder: number
  aiSummary: string | null
  aiDescription: string | null
  aiTips: string | null
  aiHighlights: string | null
  createdAt: string
  updatedAt: string
  images: ActivityImageDto[]
  links: ActivityLinkDto[]
  votes: VoteDto[]
  comments: CommentDto[]
  voteScore: number
  _count?: {
    comments: number
    votes: number
  }
}

export interface ActivityListItem extends Omit<ActivityDto, 'votes' | 'comments' | 'links'> {
  coverImage?: ActivityImageDto | null
  voteScore: number
  _count: {
    comments: number
    votes: number
  }
}

export type SortBy = 'driveTime' | 'votes' | 'category' | 'title'
