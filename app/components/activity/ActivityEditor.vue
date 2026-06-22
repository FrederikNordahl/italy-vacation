<script setup lang="ts">
import type { ActivityDto } from '../../../shared/types/activity'
import { ACTIVITY_CATEGORIES, ACTIVITY_STATUSES, VACATION_DAYS } from '../../../shared/constants/vacation'

const props = defineProps<{
  activity?: ActivityDto | null
}>()

const emit = defineEmits<{
  close: []
  saved: []
}>()

const { updateActivity, createActivity } = useActivities()

const isNew = computed(() => !props.activity?.id)

const form = reactive({
  title: props.activity?.title ?? '',
  description: props.activity?.description ?? '',
  notes: props.activity?.notes ?? '',
  category: props.activity?.category ?? 'Culture',
  status: props.activity?.status ?? 'Idea',
  driveTimeMinutes: props.activity?.driveTimeMinutes ?? null,
  distanceKm: props.activity?.distanceKm ?? null,
  estimatedDurationHours: props.activity?.estimatedDurationHours ?? null,
  address: props.activity?.address ?? '',
  latitude: props.activity?.latitude ?? null,
  longitude: props.activity?.longitude ?? null,
  scheduledDate: props.activity?.scheduledDate ?? null
})

const newLink = reactive({ title: '', url: '' })
const links = ref(props.activity?.links ?? [])
const saving = ref(false)

const categoryOptions = ACTIVITY_CATEGORIES.map(c => ({ label: c, value: c }))
const statusOptions = ACTIVITY_STATUSES.map(s => ({ label: s, value: s }))
const dateOptions = [
  { label: 'Unscheduled', value: null },
  ...VACATION_DAYS.map(d => ({ label: `${d.label} (${d.dayOfWeek})`, value: d.date }))
]

async function save() {
  saving.value = true
  try {
    const payload = { ...form }
    if (isNew.value) {
      await createActivity(payload)
    } else {
      await updateActivity(props.activity!.id, payload)
    }
    emit('saved')
  } finally {
    saving.value = false
  }
}

async function addLink() {
  if (!props.activity?.id || !newLink.title || !newLink.url) return
  const link = await $fetch('/api/links', {
    method: 'POST',
    body: {
      activityId: props.activity.id,
      title: newLink.title,
      url: newLink.url
    }
  })
  links.value.push(link)
  newLink.title = ''
  newLink.url = ''
}

async function removeLink(id: string) {
  await $fetch(`/api/links/${id}`, { method: 'DELETE' })
  links.value = links.value.filter(l => l.id !== id)
}
</script>

<template>
  <USlideover
    :open="true"
    :title="isNew ? 'New Activity' : 'Edit Activity'"
    @update:open="(v: boolean) => !v && emit('close')"
  >
    <template #body>
      <form class="space-y-4" @submit.prevent="save">
        <UFormField label="Title">
          <UInput v-model="form.title" required />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Category">
            <USelect v-model="form.category" :items="categoryOptions" />
          </UFormField>
          <UFormField label="Status">
            <USelect v-model="form.status" :items="statusOptions" />
          </UFormField>
        </div>

        <UFormField label="Scheduled date">
          <USelect
            :model-value="form.scheduledDate"
            :items="dateOptions"
            @update:model-value="form.scheduledDate = $event"
          />
        </UFormField>

        <UFormField label="Description (Markdown)">
          <UTextarea v-model="form.description" :rows="6" />
        </UFormField>

        <UFormField label="Notes">
          <UTextarea v-model="form.notes" :rows="2" />
        </UFormField>

        <div class="grid grid-cols-3 gap-4">
          <UFormField label="Drive (min)">
            <UInput v-model.number="form.driveTimeMinutes" type="number" />
          </UFormField>
          <UFormField label="Distance (km)">
            <UInput v-model.number="form.distanceKm" type="number" step="0.1" />
          </UFormField>
          <UFormField label="Duration (h)">
            <UInput v-model.number="form.estimatedDurationHours" type="number" step="0.5" />
          </UFormField>
        </div>

        <UFormField label="Address">
          <UInput v-model="form.address" />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Latitude">
            <UInput v-model.number="form.latitude" type="number" step="any" />
          </UFormField>
          <UFormField label="Longitude">
            <UInput v-model.number="form.longitude" type="number" step="any" />
          </UFormField>
        </div>

        <div v-if="!isNew" class="space-y-3 border-t border-default pt-4">
          <h4 class="font-medium text-sm">
            Links
          </h4>
          <div v-for="link in links" :key="link.id" class="flex items-center gap-2">
            <span class="text-sm flex-1 truncate">{{ link.title }}</span>
            <UButton
              icon="i-lucide-trash-2"
              color="error"
              variant="ghost"
              size="xs"
              @click="removeLink(link.id)"
            />
          </div>
          <div class="flex gap-2">
            <UInput v-model="newLink.title" placeholder="Title" class="flex-1" />
            <UInput v-model="newLink.url" placeholder="URL" class="flex-1" />
            <UButton icon="i-lucide-plus" @click="addLink" />
          </div>
        </div>

        <div class="flex gap-2 pt-4">
          <UButton type="submit" label="Save" :loading="saving" />
          <UButton label="Cancel" color="neutral" variant="ghost" @click="emit('close')" />
        </div>
      </form>
    </template>
  </USlideover>
</template>
