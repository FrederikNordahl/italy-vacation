<script setup lang="ts">
import type { ActivityListItem } from '#shared/types/activity'
import { da, categoryLabel, statusLabel } from '#shared/i18n/da'

const props = defineProps<{
  activities: ActivityListItem[]
}>()

const open = defineModel<boolean>('open', { default: false })
const step = ref<'select' | 'compare'>('select')
const selectedIds = ref<string[]>([])

const selectedActivities = computed(() =>
  props.activities.filter(a => selectedIds.value.includes(a.id))
)

function toggle(id: string) {
  const idx = selectedIds.value.indexOf(id)
  if (idx >= 0) {
    selectedIds.value.splice(idx, 1)
  } else if (selectedIds.value.length < 3) {
    selectedIds.value.push(id)
  }
}

function startCompare() {
  if (selectedIds.value.length >= 2) {
    step.value = 'compare'
  }
}

watch(open, (val) => {
  if (!val) {
    selectedIds.value = []
    step.value = 'select'
  }
})
</script>

<template>
  <USlideover v-model:open="open" :title="da.compareTitle">
    <template #body>
      <div v-if="step === 'select'" class="space-y-4">
        <p class="text-sm text-muted">
          {{ da.compareSelect }} ({{ selectedIds.length }}/3)
        </p>
        <div class="space-y-2 max-h-96 overflow-y-auto">
          <button
            v-for="activity in activities"
            :key="activity.id"
            type="button"
            class="w-full text-left p-3 rounded-lg border transition-colors"
            :class="selectedIds.includes(activity.id)
              ? 'border-primary bg-primary/5'
              : 'border-default hover:bg-elevated'"
            @click="toggle(activity.id)"
          >
            <span class="font-medium text-sm">{{ activity.title }}</span>
            <span class="text-xs text-muted block">{{ categoryLabel(activity.category) }}</span>
          </button>
        </div>
        <UButton
          :label="da.compareSelected"
          :disabled="selectedIds.length < 2"
          block
          @click="startCompare"
        />
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-default">
              <th class="text-left p-2 text-muted font-medium" />
              <th
                v-for="activity in selectedActivities"
                :key="activity.id"
                class="text-left p-2 font-medium min-w-32"
              >
                <NuxtLink :to="`/activity/${activity.id}`" class="text-primary hover:underline">
                  {{ activity.title }}
                </NuxtLink>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-default">
              <td class="p-2 text-muted">
                {{ da.category }}
              </td>
              <td v-for="a in selectedActivities" :key="a.id" class="p-2">
                {{ categoryLabel(a.category) }}
              </td>
            </tr>
            <tr class="border-b border-default">
              <td class="p-2 text-muted">
                Status
              </td>
              <td v-for="a in selectedActivities" :key="a.id" class="p-2">
                {{ statusLabel(a.status) }}
              </td>
            </tr>
            <tr class="border-b border-default">
              <td class="p-2 text-muted">
                {{ da.driveTime }}
              </td>
              <td v-for="a in selectedActivities" :key="a.id" class="p-2">
                {{ a.driveTimeMinutes ? `${a.driveTimeMinutes} min` : '—' }}
              </td>
            </tr>
            <tr class="border-b border-default">
              <td class="p-2 text-muted">
                {{ da.duration }}
              </td>
              <td v-for="a in selectedActivities" :key="a.id" class="p-2">
                {{ a.estimatedDurationHours ? `${a.estimatedDurationHours} t` : '—' }}
              </td>
            </tr>
            <tr class="border-b border-default">
              <td class="p-2 text-muted">
                {{ da.distance }}
              </td>
              <td v-for="a in selectedActivities" :key="a.id" class="p-2">
                {{ a.distanceKm ? `${a.distanceKm} km` : '—' }}
              </td>
            </tr>
            <tr>
              <td class="p-2 text-muted">
                {{ da.votes }}
              </td>
              <td v-for="a in selectedActivities" :key="a.id" class="p-2 tabular-nums">
                <span class="text-success">{{ a.upvotes }}</span>
                <span class="text-muted mx-1">/</span>
                <span class="text-error">{{ a.downvotes }}</span>
              </td>
            </tr>
          </tbody>
        </table>

        <UButton
          :label="da.changeSelection"
          color="neutral"
          variant="ghost"
          class="mt-4"
          @click="step = 'select'"
        />
      </div>
    </template>
  </USlideover>
</template>
