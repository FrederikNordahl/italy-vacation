<script setup lang="ts">
import type { ActivityListItem } from '../../shared/types/activity'

defineProps<{
  activity: ActivityListItem
  compact?: boolean
}>()

const statusColors: Record<string, 'neutral' | 'primary' | 'success' | 'warning'> = {
  Idea: 'neutral',
  Planned: 'primary',
  Booked: 'success',
  Completed: 'warning'
}
</script>

<template>
  <NuxtLink
    :to="`/activity/${activity.id}`"
    class="block glass-card rounded-xl p-3 transition-all hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5"
  >
    <div class="flex gap-3">
      <div
        v-if="activity.coverImage"
        class="shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-muted"
      >
        <img
          :src="activity.coverImage.url"
          :alt="activity.title"
          class="w-full h-full object-cover"
        >
      </div>
      <div
        v-else
        class="shrink-0 w-14 h-14 rounded-lg bg-terracotta-100 dark:bg-terracotta-900/30 flex items-center justify-center"
      >
        <UIcon name="i-lucide-map-pin" class="text-terracotta-500 size-5" />
      </div>

      <div class="min-w-0 flex-1">
        <div class="flex items-start justify-between gap-2">
          <h3 class="font-semibold text-sm leading-tight truncate">
            {{ activity.title }}
          </h3>
          <UBadge
            :color="statusColors[activity.status]"
            variant="subtle"
            size="xs"
          >
            {{ activity.status }}
          </UBadge>
        </div>

        <div class="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5 text-xs text-muted">
          <UBadge color="neutral" variant="subtle" size="xs">
            {{ activity.category }}
          </UBadge>
          <span v-if="activity.driveTimeMinutes" class="flex items-center gap-0.5">
            <UIcon name="i-lucide-car" class="size-3" />
            {{ activity.driveTimeMinutes }} min
          </span>
          <span v-if="activity.estimatedDurationHours" class="flex items-center gap-0.5">
            <UIcon name="i-lucide-clock" class="size-3" />
            {{ activity.estimatedDurationHours }}h
          </span>
          <span class="flex items-center gap-0.5">
            <UIcon name="i-lucide-thumbs-up" class="size-3" />
            {{ activity.voteScore }}
          </span>
          <span v-if="activity._count?.comments" class="flex items-center gap-0.5">
            <UIcon name="i-lucide-message-circle" class="size-3" />
            {{ activity._count.comments }}
          </span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
