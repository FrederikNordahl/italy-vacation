<script setup lang="ts">
import type { ActivityDto, ActivityLinkDto } from '#shared/types/activity'
import { renderMarkdown } from '../../utils/markdown'
import { da } from '#shared/i18n/da'

const props = defineProps<{
  activity: ActivityDto
}>()

const emit = defineEmits<{
  updated: []
  deleted: []
}>()

const { isAdmin } = useIdentity()
const { categoryLabel, statusLabel } = useDa()
const { deleteActivity, fetchActivities } = useActivities()

const showEditor = ref(false)
const uploading = ref(false)
const links = ref<ActivityLinkDto[]>([...props.activity.links])

const renderedDescription = computed(() =>
  renderMarkdown(props.activity.description)
)

const mapsUrl = computed(() => {
  if (props.activity.latitude && props.activity.longitude) {
    return `https://maps.google.com/?q=${props.activity.latitude},${props.activity.longitude}`
  }
  if (props.activity.address) {
    return `https://maps.google.com/?q=${encodeURIComponent(props.activity.address)}`
  }
  return null
})

const coverImage = computed(() =>
  props.activity.images.find(i => i.isCover) ?? props.activity.images[0]
)

async function onVoted() {
  await fetchActivities()
  emit('updated')
}

async function handleImageUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file || !isAdmin.value) return

  if (file.size > 4.5 * 1024 * 1024) {
    alert(da.imageTooLarge)
    return
  }

  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('activityId', props.activity.id)
    formData.append('file', file)
    formData.append('isCover', 'false')
    await $fetch('/api/images', { method: 'POST', body: formData })
    emit('updated')
  } finally {
    uploading.value = false
    input.value = ''
  }
}

async function handleDelete() {
  if (!confirm(da.deleteConfirm)) return
  await deleteActivity(props.activity.id)
  emit('deleted')
}

onMounted(async () => {
  links.value = await $fetch(`/api/links?activityId=${props.activity.id}`)
})
</script>

<template>
  <div class="space-y-6">
    <div v-if="coverImage" class="relative -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 mb-4">
      <img
        :src="coverImage.url"
        :alt="activity.title"
        class="w-full h-48 sm:h-64 object-cover rounded-t-xl"
      >
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-t-xl" />
      <div class="absolute bottom-4 left-4 right-4">
        <UBadge color="primary" variant="solid" class="mb-2">
          {{ categoryLabel(activity.category) }}
        </UBadge>
        <h1 class="text-2xl sm:text-3xl font-bold text-white">
          {{ activity.title }}
        </h1>
      </div>
    </div>

    <div v-else>
      <UBadge color="primary" variant="subtle" class="mb-2">
        {{ categoryLabel(activity.category) }}
      </UBadge>
      <h1 class="text-2xl sm:text-3xl font-bold">
        {{ activity.title }}
      </h1>
    </div>

    <div v-if="isAdmin" class="flex flex-wrap gap-2">
      <UButton
        :label="da.edit"
        icon="i-lucide-pencil"
        color="neutral"
        variant="outline"
        size="sm"
        @click="showEditor = true"
      />
      <label>
        <UButton
          :label="da.uploadImage"
          icon="i-lucide-image-plus"
          color="neutral"
          variant="outline"
          size="sm"
          :loading="uploading"
          as="span"
        />
        <input
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleImageUpload"
        >
      </label>
      <UButton
        :label="da.delete"
        icon="i-lucide-trash-2"
        color="error"
        variant="outline"
        size="sm"
        @click="handleDelete"
      />
    </div>

    <div class="grid sm:grid-cols-2 gap-4 p-4 rounded-xl bg-elevated/50 border border-default">
      <div v-if="activity.driveTimeMinutes" class="flex items-center gap-3">
        <UIcon name="i-lucide-car" class="size-5 text-primary" />
        <div>
          <p class="text-xs text-muted">
            {{ da.driveTime }}
          </p>
          <p class="font-semibold">
            {{ activity.driveTimeMinutes }} {{ da.minutes }}
          </p>
        </div>
      </div>
      <div v-if="activity.estimatedDurationHours" class="flex items-center gap-3">
        <UIcon name="i-lucide-clock" class="size-5 text-primary" />
        <div>
          <p class="text-xs text-muted">
            {{ da.duration }}
          </p>
          <p class="font-semibold">
            ~{{ activity.estimatedDurationHours }} {{ da.hours }}
          </p>
        </div>
      </div>
      <div v-if="activity.distanceKm" class="flex items-center gap-3">
        <UIcon name="i-lucide-route" class="size-5 text-primary" />
        <div>
          <p class="text-xs text-muted">
            {{ da.distance }}
          </p>
          <p class="font-semibold">
            {{ activity.distanceKm }} km
          </p>
        </div>
      </div>
      <div v-if="activity.address" class="flex items-center gap-3">
        <UIcon name="i-lucide-map-pin" class="size-5 text-primary" />
        <div>
          <p class="text-xs text-muted">
            {{ da.address }}
          </p>
          <p class="font-semibold text-sm">
            {{ activity.address }}
          </p>
        </div>
      </div>
      <UButton
        v-if="mapsUrl"
        :to="mapsUrl"
        target="_blank"
        :label="da.openMaps"
        icon="i-lucide-navigation"
        color="primary"
        variant="soft"
        size="sm"
        class="sm:col-span-2"
      />
    </div>

    <div
      v-if="activity.description"
      class="prose-vacation text-sm"
      v-html="renderedDescription"
    />

    <ImageGallery v-if="activity.images.length" :images="activity.images" />

    <LearnMoreLinks :links="links" />

    <div v-if="activity.notes" class="p-3 rounded-lg bg-warning/10 border border-warning/20 text-sm">
      <p class="font-medium text-warning mb-1">
        {{ da.notes }}
      </p>
      <p>{{ activity.notes }}</p>
    </div>

    <VotePanel
      :activity-id="activity.id"
      @voted="onVoted"
    />

    <ActivityEditor
      v-if="showEditor"
      :activity="activity"
      @close="showEditor = false"
      @saved="showEditor = false; emit('updated')"
    />
  </div>
</template>
