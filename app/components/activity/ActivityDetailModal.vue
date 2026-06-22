<script setup lang="ts">
import type { ActivityDto } from '#shared/types/activity'
import { da } from '#shared/i18n/da'

const { activityId, isOpen, close } = useActivityModal()
const { fetchActivities } = useActivities()

const activity = ref<ActivityDto | null>(null)
const loading = ref(false)

async function loadActivity(id: string) {
  loading.value = true
  try {
    activity.value = await $fetch<ActivityDto>(`/api/activities/${id}`)
  } catch {
    activity.value = null
  } finally {
    loading.value = false
  }
}

watch(activityId, (id) => {
  if (id) {
    loadActivity(id)
  } else {
    activity.value = null
    loading.value = false
  }
}, { immediate: true })

const open = computed({
  get: () => isOpen.value,
  set: (value: boolean) => {
    if (!value) close()
  }
})

async function onUpdated() {
  if (activityId.value) {
    await Promise.all([loadActivity(activityId.value), fetchActivities()])
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    :ui="{
      content: 'max-w-3xl w-full max-h-[95vh] overflow-hidden flex flex-col',
      body: 'overflow-y-auto flex-1'
    }"
    :title="activity?.title"
  >
    <template #body>
      <div v-if="loading" class="flex justify-center py-12">
        <UIcon name="i-lucide-loader-2" class="size-8 animate-spin text-primary" />
      </div>

      <ActivityDetailContent
        v-else-if="activity"
        :activity="activity"
        @updated="onUpdated"
        @deleted="close"
      />

      <div v-else class="text-center py-12">
        <p class="text-muted mb-4">
          {{ da.activityNotFound }}
        </p>
        <UButton :label="da.backToBoard" @click="close" />
      </div>
    </template>
  </UModal>
</template>
