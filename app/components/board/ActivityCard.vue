<script setup lang="ts">
import type { ActivityListItem } from '#shared/types/activity'

const props = defineProps<{
  activity: ActivityListItem
}>()

const { categoryLabel, categoryColor } = useDa()
const { identity, requireIdentity } = useIdentity()
const { vote } = useActivities()

const voting = ref(false)
const imageError = ref(false)

watch(() => props.activity.coverImage?.url, () => {
  imageError.value = false
})

const myVote = computed(() => {
  if (!identity.value) return null
  const apiName = toApiIdentity(identity.value)
  return props.activity.votes.find(v => v.userName === apiName || v.userName === identity.value)
})

async function castVote(value: 1 | -1) {
  if (!requireIdentity() || !identity.value || voting.value) return
  voting.value = true
  try {
    await vote(props.activity.id, identity.value, value)
  } finally {
    voting.value = false
  }
}
</script>

<template>
  <div
    class="group flex items-stretch gap-2 sm:gap-3 rounded-xl border border-default bg-elevated/40 p-2.5 sm:p-3 shadow-sm hover:shadow-md hover:border-primary/25 transition-all"
  >
    <NuxtLink
      :to="`/activity/${activity.id}`"
      class="flex items-center gap-3 min-w-0 flex-1"
    >
      <div class="shrink-0 size-16 sm:size-[4.5rem] rounded-xl overflow-hidden bg-muted ring-1 ring-default">
        <img
          v-if="activity.coverImage && !imageError"
          :src="activity.coverImage.url"
          :alt="activity.title"
          class="size-full object-cover"
          loading="lazy"
          referrerpolicy="no-referrer"
          @error="imageError = true"
        >
        <div
          v-else
          class="size-full flex items-center justify-center bg-terracotta-100 dark:bg-terracotta-900/30"
        >
          <UIcon name="i-lucide-map-pin" class="text-terracotta-500 size-6" />
        </div>
      </div>

      <div class="min-w-0 flex-1 py-0.5">
        <UBadge
          :color="categoryColor(activity.category)"
          variant="subtle"
          size="sm"
          class="mb-1.5"
        >
          {{ categoryLabel(activity.category) }}
        </UBadge>

        <p class="font-semibold text-sm sm:text-base leading-snug line-clamp-2 text-highlighted">
          {{ activity.title }}
        </p>

        <div
          v-if="activity.driveTimeMinutes || activity.estimatedDurationHours"
          class="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs sm:text-sm text-muted"
        >
          <span
            v-if="activity.driveTimeMinutes"
            class="inline-flex items-center gap-1.5"
          >
            <UIcon name="i-lucide-car" class="size-3.5 shrink-0" />
            {{ activity.driveTimeMinutes }} min
          </span>
          <span
            v-if="activity.estimatedDurationHours"
            class="inline-flex items-center gap-1.5"
          >
            <UIcon name="i-lucide-clock" class="size-3.5 shrink-0" />
            {{ activity.estimatedDurationHours }} t
          </span>
        </div>
      </div>
    </NuxtLink>

    <div
      class="vote-controls flex flex-col items-center justify-center gap-1 shrink-0 pl-1 sm:pl-2 border-l border-default/80"
      @click.stop
      @mousedown.stop
    >
      <div class="flex flex-col items-center gap-0.5">
        <UButton
          icon="i-lucide-thumbs-up"
          size="sm"
          :color="myVote?.value === 1 ? 'success' : 'neutral'"
          :variant="myVote?.value === 1 ? 'solid' : 'ghost'"
          :loading="voting"
          aria-label="Stem for"
          @click="castVote(1)"
        />
        <span class="text-xs sm:text-sm font-semibold tabular-nums text-success leading-none">
          {{ activity.upvotes }}
        </span>
      </div>
      <div class="flex flex-col items-center gap-0.5">
        <UButton
          icon="i-lucide-thumbs-down"
          size="sm"
          :color="myVote?.value === -1 ? 'error' : 'neutral'"
          :variant="myVote?.value === -1 ? 'solid' : 'ghost'"
          :loading="voting"
          aria-label="Stem imod"
          @click="castVote(-1)"
        />
        <span class="text-xs sm:text-sm font-semibold tabular-nums text-error leading-none">
          {{ activity.downvotes }}
        </span>
      </div>
    </div>
  </div>
</template>
