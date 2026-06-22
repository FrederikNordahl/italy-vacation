<script setup lang="ts">
import type { ActivityDto } from '#shared/types/activity'
import { ACTIVITY_CATEGORIES, ACTIVITY_STATUSES, VACATION_DAYS } from '#shared/constants/vacation'
import { da, categoryLabel, statusLabel } from '#shared/i18n/da'

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
  category: props.activity?.category ?? 'Other',
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

const categoryOptions = ACTIVITY_CATEGORIES.map(c => ({ label: categoryLabel(c), value: c }))
const statusOptions = ACTIVITY_STATUSES.map(s => ({ label: statusLabel(s), value: s }))
const dateOptions = [
  { label: da.unscheduled, value: null },
  ...VACATION_DAYS.map(d => ({ label: `${d.dayOfWeek} ${d.label}`, value: d.date }))
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
    :title="isNew ? da.newActivityTitle : da.editActivity"
    @update:open="(v: boolean) => !v && emit('close')"
  >
    <template #body>
      <form class="space-y-4" @submit.prevent="save">
        <UFormField :label="da.titleLabel">
          <UInput v-model="form.title" required />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField :label="da.category">
            <USelect v-model="form.category" :items="categoryOptions" />
          </UFormField>
          <UFormField label="Status">
            <USelect v-model="form.status" :items="statusOptions" />
          </UFormField>
        </div>

        <UFormField :label="da.scheduledDate">
          <USelect
            :model-value="form.scheduledDate"
            :items="dateOptions"
            @update:model-value="form.scheduledDate = $event"
          />
        </UFormField>

        <UFormField :label="da.descriptionMarkdown">
          <UTextarea v-model="form.description" :rows="6" />
        </UFormField>

        <UFormField :label="da.notes">
          <UTextarea v-model="form.notes" :rows="2" />
        </UFormField>

        <div class="grid grid-cols-3 gap-4">
          <UFormField :label="da.driveMin">
            <UInput v-model.number="form.driveTimeMinutes" type="number" />
          </UFormField>
          <UFormField :label="da.distanceKm">
            <UInput v-model.number="form.distanceKm" type="number" step="0.1" />
          </UFormField>
          <UFormField :label="da.durationH">
            <UInput v-model.number="form.estimatedDurationHours" type="number" step="0.5" />
          </UFormField>
        </div>

        <UFormField :label="da.address">
          <UInput v-model="form.address" />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField :label="da.latitude">
            <UInput v-model.number="form.latitude" type="number" step="any" />
          </UFormField>
          <UFormField :label="da.longitude">
            <UInput v-model.number="form.longitude" type="number" step="any" />
          </UFormField>
        </div>

        <div v-if="!isNew" class="space-y-3 border-t border-default pt-4">
          <h4 class="font-medium text-sm">
            {{ da.links }}
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
            <UInput v-model="newLink.title" :placeholder="da.linkTitle" class="flex-1" />
            <UInput v-model="newLink.url" :placeholder="da.linkUrl" class="flex-1" />
            <UButton icon="i-lucide-plus" @click="addLink" />
          </div>
        </div>

        <div class="flex gap-2 pt-4">
          <UButton type="submit" :label="da.save" :loading="saving" />
          <UButton :label="da.cancel" color="neutral" variant="ghost" @click="emit('close')" />
        </div>
      </form>
    </template>
  </USlideover>
</template>
