<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import type { ActivityListItem } from '#shared/types/activity'
import { da } from '#shared/i18n/da'

const props = defineProps<{
  title: string
  date: string | null
  activities: ActivityListItem[]
  isBacklog?: boolean
}>()

const emit = defineEmits<{
  change: [activities: ActivityListItem[], date: string | null]
}>()

const localActivities = ref<ActivityListItem[]>([])

watch(
  () => props.activities,
  (val) => { localActivities.value = [...val] },
  { immediate: true, deep: true }
)

function onChange() {
  emit('change', localActivities.value, props.date)
}
</script>

<template>
  <section
    class="rounded-2xl border bg-default shadow-sm overflow-hidden"
    :class="isBacklog ? 'border-dashed border-muted' : 'border-default'"
  >
    <div
      class="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-default"
      :class="isBacklog ? 'bg-muted/30' : 'bg-terracotta-50/80 dark:bg-terracotta-950/20'"
    >
      <h3 class="font-semibold text-base sm:text-lg capitalize text-highlighted">
        {{ title }}
      </h3>
      <UBadge
        v-if="localActivities.length"
        color="neutral"
        variant="subtle"
        size="md"
      >
        {{ localActivities.length }}
      </UBadge>
    </div>

    <div class="p-3 sm:p-4">
      <ClientOnly>
        <div
          class="relative rounded-xl transition-colors"
          :class="[
            localActivities.length
              ? 'min-h-0'
              : 'min-h-20 border-2 border-dashed border-muted/80 bg-muted/15 hover:border-primary/35 hover:bg-primary/5'
          ]"
        >
          <p
            v-if="!localActivities.length"
            class="absolute inset-0 flex items-center justify-center text-sm text-muted pointer-events-none px-4 text-center"
          >
            {{ da.noPlans }}
          </p>

          <VueDraggable
            v-model="localActivities"
            group="vacation-board"
            :animation="180"
            filter=".vote-controls"
            ghost-class="drag-ghost"
            class="flex flex-col gap-2.5 sm:gap-3 relative z-10"
            :class="{ 'min-h-20': !localActivities.length }"
            @sort="onChange"
            @add="onChange"
            @remove="onChange"
          >
            <ActivityCard
              v-for="activity in localActivities"
              :key="activity.id"
              :activity="activity"
            />
          </VueDraggable>
        </div>

        <template #fallback>
          <div
            class="rounded-xl p-3"
            :class="!localActivities.length ? 'min-h-20 border-2 border-dashed border-muted/80' : ''"
          >
            <p
              v-if="!localActivities.length"
              class="text-sm text-muted text-center py-6"
            >
              {{ da.noPlans }}
            </p>
            <div class="flex flex-col gap-3">
              <ActivityCard
                v-for="activity in localActivities"
                :key="activity.id"
                :activity="activity"
              />
            </div>
          </div>
        </template>
      </ClientOnly>
    </div>
  </section>
</template>
