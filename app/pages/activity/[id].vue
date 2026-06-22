<script setup lang="ts">
import type { ActivityDto } from '../../shared/types/activity'

definePageMeta({ layout: 'modal' })

const route = useRoute()
const { fetchActivities } = useActivities()

const activity = ref<ActivityDto | null>(null)
const loading = ref(true)

async function loadActivity() {
  loading.value = true
  try {
    activity.value = await $fetch<ActivityDto>(`/api/activities/${route.params.id}`)
  } catch {
    activity.value = null
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadActivity()
})

async function onUpdated() {
  await Promise.all([loadActivity(), fetchActivities()])
}
</script>

<template>
  <ActivityDetailModal
    :activity="activity"
    :loading="loading"
    @updated="onUpdated"
  />
</template>
