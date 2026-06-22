<script setup lang="ts">
import type { ActivityListItem } from '#shared/types/activity'
import { VACATION_DAYS, VACATION_START, VACATION_END } from '#shared/constants/vacation'
import { parseISO, format, isWithinInterval } from 'date-fns'
import { da } from '#shared/i18n/da'

const { isAdmin } = useIdentity()
const { byDay, batchUpdate } = useActivities()

const selectedActivityId = ref<string | null>(null)

function isVacationDay(dateStr: string) {
  const d = parseISO(dateStr)
  return isWithinInterval(d, {
    start: parseISO(VACATION_START),
    end: parseISO(VACATION_END)
  })
}

const calendarDays = computed(() => {
  const start = parseISO('2026-06-01')
  const end = parseISO('2026-07-31')
  const days: Array<{ date: string, label: string, inVacation: boolean, activities: ActivityListItem[] }> = []

  let current = start
  while (current <= end) {
    const dateStr = format(current, 'yyyy-MM-dd')
    const dayData = byDay.value.find(d => d.date === dateStr)
    days.push({
      date: dateStr,
      label: format(current, 'd'),
      inVacation: isVacationDay(dateStr),
      activities: dayData?.activities ?? []
    })
    current = new Date(current.getTime() + 86400000)
  }
  return days
})

async function moveActivity(activityId: string, newDate: string) {
  if (!isAdmin.value) return
  const dayActivities = byDay.value.find(d => d.date === newDate)?.activities ?? []
  await batchUpdate([{
    id: activityId,
    scheduledDate: newDate,
    sortOrder: dayActivities.length
  }])
}

async function assignSelectedToDay(date: string) {
  if (!selectedActivityId.value || !isAdmin.value) return
  await moveActivity(selectedActivityId.value, date)
  selectedActivityId.value = null
}

function onActivityClick(activity: ActivityListItem, event: MouseEvent) {
  if (isAdmin.value && event.shiftKey) {
    selectedActivityId.value = activity.id
    event.preventDefault()
  }
}
</script>

<template>
  <div>
    <div v-if="isAdmin && selectedActivityId" class="mb-4">
      <UAlert
        color="primary"
        variant="subtle"
        :title="da.calendarActivitySelected"
        :description="da.calendarActivitySelectedDesc"
        :actions="[{ label: da.cancel, onClick: () => { selectedActivityId = null } }]"
      />
    </div>

    <div class="grid grid-cols-7 gap-1 sm:gap-2">
      <div
        v-for="day in da.weekDays"
        :key="day"
        class="text-center text-xs font-medium text-muted py-2"
      >
        {{ day }}
      </div>

      <div
        v-for="day in calendarDays"
        :key="day.date"
        :class="[
          'min-h-20 sm:min-h-28 rounded-lg border p-1 sm:p-2 transition-colors',
          day.inVacation ? 'bg-primary/5 border-primary/20' : 'bg-elevated/30 border-default',
          isAdmin && day.inVacation ? 'cursor-pointer hover:bg-primary/10' : ''
        ]"
        @click="day.inVacation && assignSelectedToDay(day.date)"
      >
        <div
          :class="[
            'text-xs font-medium mb-1',
            day.inVacation ? 'text-primary' : 'text-muted'
          ]"
        >
          {{ day.label }}
        </div>

        <div class="flex flex-col gap-1">
          <NuxtLink
            v-for="activity in day.activities"
            :key="activity.id"
            :to="`/activity/${activity.id}`"
            class="text-xs px-1.5 py-1 rounded bg-elevated border border-default truncate hover:bg-primary/10 transition-colors"
            :class="{ 'ring-2 ring-primary': selectedActivityId === activity.id }"
            @click="onActivityClick(activity, $event)"
          >
            {{ activity.title }}
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="mt-4 flex flex-wrap gap-2 text-xs text-muted">
      <span class="flex items-center gap-1">
        <span class="w-3 h-3 rounded bg-primary/20 border border-primary/30" />
        {{ da.calendarVacationDays }} ({{ VACATION_DAYS[0]?.label }} – {{ VACATION_DAYS[VACATION_DAYS.length - 1]?.label }})
      </span>
      <span v-if="isAdmin">{{ da.calendarShiftHint }}</span>
    </div>
  </div>
</template>
