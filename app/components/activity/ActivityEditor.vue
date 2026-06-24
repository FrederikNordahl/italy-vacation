<script setup lang="ts">
import type { ActivityDto, ActivityImageDto } from '#shared/types/activity'
import {
  ACTIVITY_CATEGORIES,
  ACTIVITY_STATUSES,
  VACATION_DAYS,
  type ActivityCategory
} from '#shared/constants/vacation'
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

const open = computed({
  get: () => true,
  set: (value: boolean) => {
    if (!value) emit('close')
  }
})

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
  scheduledDate: props.activity?.scheduledDate ?? null
})

const newLink = reactive({ title: '', url: '' })
const links = ref(props.activity?.links ?? [])
const saving = ref(false)
const uploadingImages = ref(false)

interface PendingImage {
  file: File
  preview: string
}

const pendingImages = ref<PendingImage[]>([])
const existingImages = ref(props.activity?.images ?? [])

const showTravel = ref(!isNew.value && !!(props.activity?.driveTimeMinutes || props.activity?.estimatedDurationHours || props.activity?.address))

const maxImageSize = 4.5 * 1024 * 1024

function addImageFiles(files: FileList | File[] | null | undefined) {
  if (!files?.length) return

  for (const file of files) {
    if (!file.type.startsWith('image/')) continue
    if (file.size > maxImageSize) {
      alert(da.imageTooLarge)
      continue
    }
    pendingImages.value.push({
      file,
      preview: URL.createObjectURL(file)
    })
  }
}

function onImageInput(event: Event) {
  const input = event.target as HTMLInputElement
  addImageFiles(input.files)
  input.value = ''
}

function onImageDrop(event: DragEvent) {
  event.preventDefault()
  addImageFiles(event.dataTransfer?.files)
}

function removePendingImage(index: number) {
  const item = pendingImages.value[index]
  if (item) URL.revokeObjectURL(item.preview)
  pendingImages.value.splice(index, 1)
}

async function uploadImages(activityId: string) {
  if (!pendingImages.value.length) return

  uploadingImages.value = true
  try {
    const hasExisting = existingImages.value.length > 0
    for (let i = 0; i < pendingImages.value.length; i++) {
      const { file } = pendingImages.value[i]!
      const formData = new FormData()
      formData.append('activityId', activityId)
      formData.append('file', file)
      formData.append('isCover', String(!hasExisting && i === 0))
      const image = await $fetch<ActivityImageDto>('/api/images', {
        method: 'POST',
        body: formData
      })
      existingImages.value.push(image)
    }
    pendingImages.value.forEach(item => URL.revokeObjectURL(item.preview))
    pendingImages.value = []
  } finally {
    uploadingImages.value = false
  }
}

onUnmounted(() => {
  pendingImages.value.forEach(item => URL.revokeObjectURL(item.preview))
})

const statusOptions = ACTIVITY_STATUSES.map(s => ({ label: statusLabel(s), value: s }))
const dateOptions = [
  { label: da.unscheduled, value: null as string | null },
  ...VACATION_DAYS.map(d => ({
    label: `${d.dayOfWeek} ${d.label}`,
    value: d.date
  }))
]

const categoryIcons: Record<ActivityCategory, string> = {
  Wine: 'i-lucide-wine',
  Food: 'i-lucide-utensils',
  Sightseeing: 'i-lucide-binoculars',
  Nature: 'i-lucide-trees',
  Swimming: 'i-lucide-waves',
  Historic: 'i-lucide-landmark',
  Event: 'i-lucide-party-popper',
  Relaxation: 'i-lucide-sparkles',
  Other: 'i-lucide-map-pin'
}

async function save() {
  if (!form.title.trim()) return
  saving.value = true
  try {
    const payload = { ...form, title: form.title.trim() }
    let activityId = props.activity?.id

    if (isNew.value) {
      const created = await createActivity(payload)
      activityId = created.id
    } else {
      await updateActivity(props.activity!.id, payload)
    }

    if (activityId) {
      await uploadImages(activityId)
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
  <UModal
    v-model:open="open"
    :title="isNew ? da.newActivityTitle : da.editActivity"
    :description="isNew ? da.newActivityDesc : da.editActivityDesc"
    :ui="{
      content: 'max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col',
      body: 'overflow-y-auto flex-1 w-full',
      footer: 'justify-end gap-2'
    }"
  >
    <template #body>
      <form
        id="activity-editor-form"
        class="w-full space-y-6"
        @submit.prevent="save"
      >
        <UFormField :label="da.titleLabel" required class="w-full">
          <UInput
            v-model="form.title"
            :placeholder="da.titlePlaceholder"
            size="lg"
            class="w-full"
            autofocus
            required
          />
        </UFormField>

        <UFormField :label="da.descriptionLabel" class="w-full">
          <UTextarea
            v-model="form.description"
            :rows="4"
            :placeholder="da.descriptionPlaceholder"
            class="w-full"
          />
        </UFormField>

        <UFormField :label="da.notes" class="w-full">
          <UTextarea
            v-model="form.notes"
            :rows="3"
            :placeholder="da.notesPlaceholder"
            class="w-full"
          />
        </UFormField>

        <div class="w-full space-y-3">
          <div>
            <p class="text-sm font-medium text-highlighted">
              {{ da.imagesSection }}
            </p>
            <p class="text-xs text-muted mt-0.5">
              {{ da.imagesDesc }}
            </p>
          </div>

          <div
            v-if="existingImages.length || pendingImages.length"
            class="grid grid-cols-3 sm:grid-cols-4 gap-2"
          >
            <div
              v-for="image in existingImages"
              :key="image.id"
              class="relative aspect-square rounded-xl overflow-hidden ring-1 ring-default"
            >
              <img
                :src="image.url"
                alt=""
                class="size-full object-cover"
              >
              <UBadge
                v-if="image.isCover"
                color="primary"
                size="xs"
                class="absolute top-1 left-1"
              >
                {{ da.coverImage }}
              </UBadge>
            </div>
            <div
              v-for="(item, index) in pendingImages"
              :key="item.preview"
              class="relative aspect-square rounded-xl overflow-hidden ring-1 ring-primary/40"
            >
              <img
                :src="item.preview"
                alt=""
                class="size-full object-cover"
              >
              <button
                type="button"
                class="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-default/90 text-muted hover:text-error transition-colors"
                @click="removePendingImage(index)"
              >
                <UIcon name="i-lucide-x" class="size-3.5" />
              </button>
            </div>
          </div>

          <label
            class="flex flex-col items-center justify-center gap-2 w-full rounded-xl border-2 border-dashed border-muted/80 bg-muted/10 px-4 py-8 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors"
            @dragover.prevent
            @drop="onImageDrop"
          >
            <UIcon name="i-lucide-image-plus" class="size-8 text-muted" />
            <span class="text-sm font-medium text-highlighted">{{ da.addImages }}</span>
            <span class="text-xs text-muted">{{ da.imageSizeHint }}</span>
            <input
              type="file"
              accept="image/*"
              multiple
              class="sr-only"
              @change="onImageInput"
            >
          </label>
        </div>

        <div class="space-y-2 w-full">
          <p class="text-sm font-medium text-highlighted">
            {{ da.pickCategory }}
          </p>
          <div class="grid grid-cols-3 sm:grid-cols-3 gap-2">
            <button
              v-for="category in ACTIVITY_CATEGORIES"
              :key="category"
              type="button"
              class="flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all"
              :class="form.category === category
                ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                : 'border-default bg-elevated/40 hover:border-primary/30 hover:bg-elevated'"
              @click="form.category = category"
            >
              <UIcon
                :name="categoryIcons[category]"
                class="size-5"
                :class="form.category === category ? 'text-primary' : 'text-muted'"
              />
              <span class="text-xs font-medium leading-tight">
                {{ categoryLabel(category) }}
              </span>
            </button>
          </div>
        </div>

        <div class="space-y-2">
          <p class="text-sm font-medium text-highlighted">
            {{ da.scheduledDate }}
          </p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="option in dateOptions"
              :key="option.value ?? 'unscheduled'"
              type="button"
              class="rounded-full border px-3 py-1.5 text-sm transition-all"
              :class="form.scheduledDate === option.value
                ? 'border-primary bg-primary text-inverted font-medium'
                : 'border-default bg-elevated/40 text-muted hover:border-primary/40'"
              @click="form.scheduledDate = option.value"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <div v-if="!isNew" class="space-y-2">
          <UFormField label="Status">
            <USelect v-model="form.status" :items="statusOptions" />
          </UFormField>
        </div>

        <div class="rounded-xl border border-default overflow-hidden">
          <button
            type="button"
            class="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-elevated/50 transition-colors"
            @click="showTravel = !showTravel"
          >
            <span class="text-sm font-medium">{{ da.travelSection }}</span>
            <UIcon
              name="i-lucide-chevron-down"
              class="size-4 text-muted transition-transform"
              :class="{ 'rotate-180': showTravel }"
            />
          </button>
          <div v-show="showTravel" class="space-y-4 border-t border-default px-4 py-4">
            <div class="grid grid-cols-3 gap-3">
              <UFormField :label="da.driveMin">
                <UInput
                  v-model.number="form.driveTimeMinutes"
                  type="number"
                  min="0"
                  placeholder="45"
                />
              </UFormField>
              <UFormField :label="da.distanceKm">
                <UInput
                  v-model.number="form.distanceKm"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="30"
                />
              </UFormField>
              <UFormField :label="da.durationH">
                <UInput
                  v-model.number="form.estimatedDurationHours"
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="3"
                />
              </UFormField>
            </div>
            <UFormField :label="da.address" class="w-full">
              <UInput v-model="form.address" :placeholder="da.address" class="w-full" />
            </UFormField>
          </div>
        </div>

        <div v-if="!isNew" class="space-y-3 rounded-xl border border-default p-4 w-full">
          <h4 class="font-medium text-sm">
            {{ da.links }}
          </h4>
          <div
            v-for="link in links"
            :key="link.id"
            class="flex items-center gap-2"
          >
            <span class="text-sm flex-1 truncate">{{ link.title }}</span>
            <UButton
              icon="i-lucide-trash-2"
              color="error"
              variant="ghost"
              size="xs"
              @click="removeLink(link.id)"
            />
          </div>
          <div class="flex flex-col sm:flex-row gap-2">
            <UInput v-model="newLink.title" :placeholder="da.linkTitle" class="flex-1" />
            <UInput v-model="newLink.url" :placeholder="da.linkUrl" class="flex-1" />
            <UButton icon="i-lucide-plus" :label="da.create" @click="addLink" />
          </div>
        </div>
      </form>
    </template>

    <template #footer>
      <UButton
        :label="da.cancel"
        color="neutral"
        variant="ghost"
        @click="emit('close')"
      />
      <UButton
        type="submit"
        form="activity-editor-form"
        :label="isNew ? da.create : da.save"
        icon="i-lucide-check"
        :loading="saving || uploadingImages"
        :disabled="!form.title.trim()"
      />
    </template>
  </UModal>
</template>
