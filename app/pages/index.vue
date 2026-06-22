<script setup lang="ts">
import { da } from '#shared/i18n/da'

definePageMeta({ layout: 'default' })

const { requireIdentity } = useIdentity()
const { activities, loading, error, fetchActivities } = useActivities()

const createOpen = ref(false)

function openCreate() {
  if (!requireIdentity()) return
  createOpen.value = true
}

await useAsyncData('activities-list', () => fetchActivities())
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-highlighted">
          {{ da.vacationPlanner }}
        </h1>
        <p class="mt-1.5 text-sm sm:text-base text-muted max-w-2xl">
          {{ da.vacationPlannerDesc }}
        </p>
      </div>

      <UButton
        :label="da.newActivity"
        icon="i-lucide-plus"
        size="lg"
        class="shrink-0"
        @click="openCreate"
      />
    </div>

    <UAlert
      v-if="error"
      color="error"
      variant="subtle"
      :title="error"
    />

    <div v-if="loading && !activities.length" class="flex justify-center py-16">
      <UIcon name="i-lucide-loader-2" class="size-8 animate-spin text-primary" />
    </div>

    <UEmpty
      v-else-if="!activities.length"
      icon="i-lucide-map"
      :title="da.noActivities"
      :description="da.noActivitiesDesc"
      class="py-16"
    />

    <VacationBoard v-else />

    <ActivityEditor
      v-if="createOpen"
      @close="createOpen = false"
      @saved="createOpen = false; fetchActivities()"
    />
  </div>
</template>
