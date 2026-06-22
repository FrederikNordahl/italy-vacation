<script setup lang="ts">
import type { ActivityListItem } from '#shared/types/activity'
import { da } from '#shared/i18n/da'

const { unscheduled, byDay, batchUpdate } = useActivities()

const columns = computed(() => [
  {
    title: da.unscheduled,
    date: null as string | null,
    activities: unscheduled.value,
    isBacklog: true
  },
  ...byDay.value.map(day => ({
    title: `${day.dayOfWeek} ${day.label}`,
    date: day.date,
    activities: day.activities,
    isBacklog: false
  }))
])

async function handleColumnChange(
  activities: ActivityListItem[],
  date: string | null
) {
  const updates = activities.map((activity, index) => ({
    id: activity.id,
    scheduledDate: date,
    sortOrder: index
  }))

  if (updates.length) {
    await batchUpdate(updates)
  }
}
</script>

<template>
  <div class="flex flex-col gap-4 sm:gap-5">
    <BoardColumn
      v-for="col in columns"
      :key="col.date ?? 'unscheduled'"
      :title="col.title"
      :date="col.date"
      :activities="col.activities"
      :is-backlog="col.isBacklog"
      @change="handleColumnChange"
    />
  </div>
</template>
