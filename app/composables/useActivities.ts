import type { ActivityListItem } from '#shared/types/activity'
import { VACATION_DAYS } from '#shared/constants/vacation'

export function useActivities() {
  const activities = useState<ActivityListItem[]>('activities', () => [])
  const loading = useState('activities-loading', () => false)
  const error = useState<string | null>('activities-error', () => null)

  async function fetchActivities() {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<ActivityListItem[]>('/api/activities')
      activities.value = data
      return data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Kunne ikke hente aktiviteter'
      activities.value = []
      return []
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
    const updated = await $fetch<ActivityListItem>(`/api/activities/${id}`, {
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
      const current = activities.value[idx]
      if (idx !== -1 && current) {
        activities.value[idx] = {
          ...current,
          scheduledDate: u.scheduledDate,
          sortOrder: u.sortOrder
        }
      }
    }

    try {
      const firstId = updates[0]?.id
      if (!firstId) return

      const result = await $fetch<ActivityListItem[]>(`/api/activities/${firstId}`, {
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
      throw new Error('Kunne ikke gemme ændringer på tidsplanen')
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

  return {
    activities,
    loading,
    error,
    unscheduled,
    byDay,
    fetchActivities,
    getByDate,
    getActivity,
    updateActivity,
    batchUpdate,
    createActivity,
    deleteActivity,
    vote
  }
}
