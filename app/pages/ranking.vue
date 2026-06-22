<script setup lang="ts">
import { ACTIVITY_CATEGORIES } from '#shared/constants/vacation'
import { da, categoryLabel } from '#shared/i18n/da'

definePageMeta({ layout: 'default' })

const { activities, loading, fetchActivities } = useActivities()

await useAsyncData('activities-list', () => fetchActivities())

const sortedByVotes = computed(() =>
  [...activities.value].sort((a, b) => b.upvotes - a.upvotes || a.downvotes - b.downvotes)
)

const mostPopular = computed(() => sortedByVotes.value.slice(0, 5))
const leastPopular = computed(() =>
  [...activities.value]
    .filter(a => a.downvotes > 0)
    .sort((a, b) => b.downvotes - a.downvotes || a.upvotes - b.upvotes)
    .slice(0, 5)
)

const byCategory = computed(() =>
  ACTIVITY_CATEGORIES.map(cat => ({
    category: cat,
    activities: [...activities.value]
      .filter(a => a.category === cat)
      .sort((a, b) => b.upvotes - a.upvotes || a.downvotes - b.downvotes)
  })).filter(g => g.activities.length > 0)
)

const shortestDrive = computed(() =>
  [...activities.value]
    .filter(a => a.driveTimeMinutes)
    .sort((a, b) => (a.driveTimeMinutes ?? 0) - (b.driveTimeMinutes ?? 0))
    .slice(0, 5)
)

const longestDrive = computed(() =>
  [...activities.value]
    .filter(a => a.driveTimeMinutes)
    .sort((a, b) => (b.driveTimeMinutes ?? 0) - (a.driveTimeMinutes ?? 0))
    .slice(0, 5)
)
</script>

<template>
  <div>
    <h1 class="text-2xl sm:text-3xl font-bold mb-6">
      {{ da.rankings }}
    </h1>

    <div v-if="loading" class="flex justify-center py-16">
      <UIcon name="i-lucide-loader-2" class="size-8 animate-spin text-primary" />
    </div>

    <div v-else class="space-y-8">
      <section>
        <h2 class="text-lg font-semibold mb-3 flex items-center gap-2">
          <UIcon name="i-lucide-trophy" class="text-primary" />
          {{ da.mostPopular }}
        </h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <ActivityCard
            v-for="activity in mostPopular"
            :key="activity.id"
            :activity="activity"
          />
        </div>
      </section>

      <section v-if="leastPopular.length">
        <h2 class="text-lg font-semibold mb-3">
          {{ da.leastPopular }}
        </h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <ActivityCard
            v-for="activity in leastPopular"
            :key="activity.id"
            :activity="activity"
          />
        </div>
      </section>

      <section v-for="group in byCategory" :key="group.category">
        <h2 class="text-lg font-semibold mb-3">
          {{ categoryLabel(group.category) }}
        </h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <ActivityCard
            v-for="activity in group.activities"
            :key="activity.id"
            :activity="activity"
          />
        </div>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3">
          {{ da.shortestDrives }}
        </h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <ActivityCard
            v-for="activity in shortestDrive"
            :key="activity.id"
            :activity="activity"
          />
        </div>
      </section>

      <section>
        <h2 class="text-lg font-semibold mb-3">
          {{ da.longestDrives }}
        </h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <ActivityCard
            v-for="activity in longestDrive"
            :key="activity.id"
            :activity="activity"
          />
        </div>
      </section>
    </div>
  </div>
</template>
