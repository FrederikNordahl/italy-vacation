<script setup lang="ts">
import type { ActivityListItem } from '../../../shared/types/activity'
import { VACATION_DAYS } from '../../../shared/constants/vacation'

const { isAdmin } = useIdentity()
const { unscheduled, byDay, batchUpdate } = useActivities()

const columns = computed(() => [
  { title: 'Unscheduled', subtitle: 'Ideas & backlog', date: null as string | null, activities: unscheduled.value },
  ...byDay.value.map(day => ({
    title: day.label,
    subtitle: day.dayOfWeek,
    date: day.date,
    activities: day.activities
  }))
])

async function handleColumnChange(
  activities: ActivityListItem[],
  date: string | null
) {
  if (!isAdmin.value) return

  const updates = activities.map((activity, index) => ({
    id: activity.id,
    scheduledDate: date,
    sortOrder: index
  }))

  if (updates.length) {
    await batchUpdate(updates)
  }
}

async function handleDragEnd() {
  // Column components emit individual change events
}
</script>

<template>
  <div class="flex gap-4 overflow-x-auto pb-4 board-column-scroll -mx-4 px-4 sm:mx-0 sm:px-0">
    <BoardColumn
      v-for="col in columns"
      :key="col.date ?? 'unscheduled'"
      :title="col.title"
      :subtitle="col.subtitle"
      :date="col.date"
      :activities="col.activities"
      :disabled="!isAdmin"
      @change="handleColumnChange"
    />
  </div>
</template>
