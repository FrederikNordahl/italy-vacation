<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import type { ActivityListItem } from '../../../shared/types/activity'

const props = defineProps<{
  title: string
  subtitle?: string
  date: string | null
  activities: ActivityListItem[]
  disabled?: boolean
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
  <div class="flex flex-col w-72 shrink-0 rounded-xl bg-elevated/50 border border-default">
    <div class="p-3 border-b border-default">
      <h3 class="font-semibold text-sm">
        {{ title }}
      </h3>
      <p v-if="subtitle" class="text-xs text-muted mt-0.5">
        {{ subtitle }}
      </p>
      <UBadge color="neutral" variant="subtle" size="xs" class="mt-1">
        {{ localActivities.length }}
      </UBadge>
    </div>

    <div class="p-2 flex-1 min-h-[120px] max-h-[calc(100vh-280px)] overflow-y-auto board-column-scroll">
      <VueDraggable
        v-model="localActivities"
        group="vacation-board"
        :disabled="disabled"
        :animation="200"
        ghost-class="drag-ghost"
        class="flex flex-col gap-2 min-h-[80px]"
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

      <p
        v-if="!localActivities.length"
        class="text-xs text-muted text-center py-6"
      >
        Drop activities here
      </p>
    </div>
  </div>
</template>
