import type { ActivityListItem, SortBy } from '../../shared/types/activity'
import { VACATION_DAYS } from '../../shared/constants/vacation'

interface ActivityFilters {
  search: string
  category: string | null
  maxDriveMinutes: number | null
  sortBy: SortBy
}

const activities = ref<ActivityListItem[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const filters = ref<ActivityFilters>({
  search: '',
  category: null,
  maxDriveMinutes: null,
  sortBy: 'driveTime'
})

export function useActivities() {
  async function fetchActivities() {
    loading.value = true
    error.value = null
    try {
      const params = new URLSearchParams()
      if (filters.value.search) params.set('search', filters.value.search)
      if (filters.value.category) params.set('category', filters.value.category)
      if (filters.value.maxDriveMinutes !== null) {
        params.set('maxDriveMinutes', String(filters.value.maxDriveMinutes))
      }
      if (filters.value.sortBy) params.set('sortBy', filters.value.sortBy)

      const query = params.toString()
      const data = await $fetch<ActivityListItem[]>(
        `/api/activities${query ? `?${query}` : ''}`
      )
      activities.value = data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load activities'
    } finally {
      loading.value = false
    }
  }

  function getByDate(date: string | null) {
    return activities.value
      .filter(a => (a.scheduledDate ?? null) === date)
      .sort((a, b) => a.sortOrder - b.sortOrder)
  }

  const unscheduled = computed(() => getByDate(null))

  const byDay = computed(() =>
    VACATION_DAYS.map(day => ({
      ...day,
      activities: getByDate(day.date)
    }))
  )

  function getActivity(id: string) {
    return activities.value.find(a => a.id === id)
  }

  async function updateActivity(id: string, data: Record<string, unknown>) {
    const updated = await $fetch(`/api/activities/${id}`, {
      method: 'PATCH',
      body: data
    })
    const idx = activities.value.findIndex(a => a.id === id)
    if (idx !== -1) {
      activities.value[idx] = { ...activities.value[idx], ...updated }
    }
    return updated
  }

  async function batchUpdate(updates: Array<{
    id: string
    scheduledDate: string | null
    sortOrder: number
  }>) {
    if (!updates.length) return

    const previous = [...activities.value]
    for (const u of updates) {
      const idx = activities.value.findIndex(a => a.id === u.id)
      if (idx !== -1) {
        activities.value[idx] = {
          ...activities.value[idx],
          scheduledDate: u.scheduledDate,
          sortOrder: u.sortOrder
        }
      }
    }

    try {
      const result = await $fetch<ActivityListItem[]>(`/api/activities/${updates[0].id}`, {
        method: 'PATCH',
        body: { batchUpdates: updates }
      })

      if (Array.isArray(result)) {
        for (const item of result) {
          const idx = activities.value.findIndex(a => a.id === item.id)
          if (idx !== -1) activities.value[idx] = item
        }
      }
    } catch {
      activities.value = previous
      throw new Error('Failed to save schedule changes')
    }
  }

  async function createActivity(data: Record<string, unknown>) {
    const created = await $fetch<ActivityListItem>('/api/activities', {
      method: 'POST',
      body: data
    })
    await fetchActivities()
    return created
  }

  async function deleteActivity(id: string) {
    await $fetch(`/api/activities/${id}`, { method: 'DELETE' })
    activities.value = activities.value.filter(a => a.id !== id)
  }

  async function vote(activityId: string, userName: string, value: 1 | -1) {
    await $fetch('/api/votes', {
      method: 'POST',
      body: { activityId, userName, value }
    })
    await fetchActivities()
  }

  async function addComment(activityId: string, userName: string, message: string) {
    const comment = await $fetch('/api/comments', {
      method: 'POST',
      body: { activityId, userName, message }
    })
    const activity = activities.value.find(a => a.id === activityId)
    if (activity?._count) {
      activity._count.comments += 1
    }
    return comment
  }

  return {
    activities,
    loading,
    error,
    filters,
    unscheduled,
    byDay,
    fetchActivities,
    getByDate,
    getActivity,
    updateActivity,
    batchUpdate,
    createActivity,
    deleteActivity,
    vote,
    addComment
  }
}
