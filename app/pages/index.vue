<script setup lang="ts">
import {
  ACTIVITY_CATEGORIES,
  DRIVE_TIME_FILTERS
} from '../../shared/constants/vacation'
import type { SortBy } from '../../shared/types/activity'

definePageMeta({ layout: 'default' })

const { identity, showPicker, isAdmin } = useIdentity()
const { activities, loading, error, filters, fetchActivities } = useActivities()

const viewMode = ref<'board' | 'calendar'>('board')
const compareOpen = ref(false)
const createOpen = ref(false)

const categoryOptions = [
  { label: 'All categories', value: null },
  ...ACTIVITY_CATEGORIES.map(c => ({ label: c, value: c }))
]

const sortOptions = [
  { label: 'Drive time', value: 'driveTime' },
  { label: 'Votes', value: 'votes' },
  { label: 'Category', value: 'category' },
  { label: 'Title', value: 'title' }
]

onMounted(() => {
  fetchActivities()
  if (!identity.value) {
    showPicker.value = true
  }
})

watch(filters, () => fetchActivities(), { deep: true })

let searchTimeout: ReturnType<typeof setTimeout>
watch(() => filters.value.search, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => fetchActivities(), 300)
})
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl sm:text-3xl font-bold mb-1">
        Vacation Planner
      </h1>
      <p class="text-muted text-sm">
        Drag activities onto days or switch to calendar view. Click any card for details.
      </p>
    </div>

    <div class="flex flex-col gap-4 mb-6">
      <div class="flex flex-wrap items-center gap-2">
        <UFieldGroup>
          <UButton
            label="Board"
            icon="i-lucide-layout-grid"
            :color="viewMode === 'board' ? 'primary' : 'neutral'"
            :variant="viewMode === 'board' ? 'solid' : 'outline'"
            @click="viewMode = 'board'"
          />
          <UButton
            label="Calendar"
            icon="i-lucide-calendar"
            :color="viewMode === 'calendar' ? 'primary' : 'neutral'"
            :variant="viewMode === 'calendar' ? 'solid' : 'outline'"
            @click="viewMode = 'calendar'"
          />
        </UFieldGroup>

        <UInput
          v-model="filters.search"
          icon="i-lucide-search"
          placeholder="Search activities..."
          class="w-full sm:w-48"
        />

        <USelect
          :model-value="filters.category"
          :items="categoryOptions"
          placeholder="Category"
          class="w-full sm:w-40"
          @update:model-value="filters.category = $event"
        />

        <USelect
          :model-value="filters.sortBy"
          :items="sortOptions"
          class="w-full sm:w-36"
          @update:model-value="filters.sortBy = $event as SortBy"
        />

        <UButton
          label="Compare"
          icon="i-lucide-columns-2"
          color="neutral"
          variant="outline"
          @click="compareOpen = true"
        />

        <UButton
          v-if="isAdmin"
          label="New activity"
          icon="i-lucide-plus"
          @click="createOpen = true"
        />
      </div>

      <div class="flex flex-wrap gap-2">
        <UButton
          v-for="chip in DRIVE_TIME_FILTERS"
          :key="chip.label"
          :label="chip.label"
          size="xs"
          :color="filters.maxDriveMinutes === chip.value ? 'primary' : 'neutral'"
          :variant="filters.maxDriveMinutes === chip.value ? 'solid' : 'outline'"
          @click="filters.maxDriveMinutes = filters.maxDriveMinutes === chip.value ? null : chip.value"
        />
      </div>
    </div>

    <UAlert
      v-if="error"
      color="error"
      variant="subtle"
      :title="error"
      class="mb-4"
    />

    <div v-if="loading && !activities.length" class="flex justify-center py-16">
      <UIcon name="i-lucide-loader-2" class="size-8 animate-spin text-primary" />
    </div>

    <VacationBoard v-else-if="viewMode === 'board'" />
    <VacationCalendar v-else />

    <CompareDrawer
      v-model:open="compareOpen"
      :activities="activities"
    />

    <ActivityEditor
      v-if="createOpen && isAdmin"
      @close="createOpen = false"
      @saved="createOpen = false; fetchActivities()"
    />
  </div>
</template>
