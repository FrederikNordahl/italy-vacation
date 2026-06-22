<script setup lang="ts">
import { VACATION_DAYS } from '#shared/constants/vacation'
import { da } from '#shared/i18n/da'

definePageMeta({ layout: 'default' })

const { activities, loading, fetchActivities } = useActivities()

await useAsyncData('activities-list', () => fetchActivities())

const itineraryStatuses = ['Planned', 'Booked', 'Completed']

const itineraryByDay = computed(() =>
  VACATION_DAYS.map(day => ({
    ...day,
    activities: activities.value
      .filter(a =>
        a.scheduledDate === day.date
        && itineraryStatuses.includes(a.status)
      )
      .sort((a, b) => a.sortOrder - b.sortOrder)
  })).filter(day => day.activities.length > 0)
)

const unscheduledPlanned = computed(() =>
  activities.value.filter(a =>
    !a.scheduledDate && itineraryStatuses.includes(a.status)
  )
)
</script>

<template>
  <div>
    <h1 class="text-2xl sm:text-3xl font-bold mb-2">
      {{ da.itinerary }}
    </h1>
    <p class="text-muted text-sm mb-6">
      {{ da.itineraryDesc }}
    </p>

    <div v-if="loading" class="flex justify-center py-16">
      <UIcon name="i-lucide-loader-2" class="size-8 animate-spin text-primary" />
    </div>

    <div v-else-if="!itineraryByDay.length && !unscheduledPlanned.length" class="text-center py-16">
      <UIcon name="i-lucide-calendar-off" class="size-12 text-muted mx-auto mb-4" />
      <p class="text-muted">
        {{ da.noItinerary }}
      </p>
      <UButton :label="da.goToBoard" to="/" class="mt-4" />
    </div>

    <div v-else class="space-y-6">
      <section
        v-for="day in itineraryByDay"
        :key="day.date"
        class="glass-card rounded-xl p-4 sm:p-6"
      >
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <UIcon name="i-lucide-calendar" class="text-primary" />
          </div>
          <div>
            <h2 class="font-semibold">
              {{ day.dayOfWeek }}, {{ day.label }}
            </h2>
            <p class="text-xs text-muted">
              {{ da.activityCount(day.activities.length) }}
            </p>
          </div>
        </div>

        <div class="space-y-3 pl-4 border-l-2 border-primary/20">
          <div
            v-for="activity in day.activities"
            :key="activity.id"
            class="relative"
          >
            <ActivityCard :activity="activity" />
          </div>
        </div>
      </section>

      <section v-if="unscheduledPlanned.length" class="glass-card rounded-xl p-4 sm:p-6">
        <h2 class="font-semibold mb-4">
          {{ da.plannedUnscheduled }}
        </h2>
        <div class="space-y-3">
          <ActivityCard
            v-for="activity in unscheduledPlanned"
            :key="activity.id"
            :activity="activity"
          />
        </div>
      </section>
    </div>
  </div>
</template>
