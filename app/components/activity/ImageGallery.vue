<script setup lang="ts">
import type { ActivityImageDto } from '#shared/types/activity'

const props = defineProps<{
  images: ActivityImageDto[]
}>()

const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

const sortedImages = computed(() =>
  [...props.images].sort((a, b) => a.sortOrder - b.sortOrder)
)

function openLightbox(index: number) {
  lightboxIndex.value = index
  lightboxOpen.value = true
}
</script>

<template>
  <div v-if="sortedImages.length" class="grid grid-cols-2 sm:grid-cols-3 gap-2">
    <button
      v-for="(image, index) in sortedImages"
      :key="image.id"
      type="button"
      class="relative aspect-video rounded-lg overflow-hidden group cursor-pointer"
      @click="openLightbox(index)"
    >
      <img
        :src="image.url"
        :alt="`Image ${index + 1}`"
        class="w-full h-full object-cover transition-transform group-hover:scale-105"
      >
      <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
    </button>
  </div>

  <UModal
    v-model:open="lightboxOpen"
    :ui="{ content: 'max-w-4xl' }"
  >
    <template #body>
      <div class="relative">
        <img
          :src="sortedImages[lightboxIndex]?.url"
          :alt="`Image ${lightboxIndex + 1}`"
          class="w-full max-h-[70vh] object-contain rounded-lg"
        >
        <div v-if="sortedImages.length > 1" class="flex justify-center gap-2 mt-4">
          <UButton
            icon="i-lucide-chevron-left"
            color="neutral"
            variant="ghost"
            :disabled="lightboxIndex === 0"
            @click="lightboxIndex--"
          />
          <span class="text-sm text-muted self-center">
            {{ lightboxIndex + 1 }} / {{ sortedImages.length }}
          </span>
          <UButton
            icon="i-lucide-chevron-right"
            color="neutral"
            variant="ghost"
            :disabled="lightboxIndex === sortedImages.length - 1"
            @click="lightboxIndex++"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>
