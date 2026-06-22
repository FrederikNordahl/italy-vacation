<script setup lang="ts">
import type { ActivityDto } from '../../../shared/types/activity'

const props = defineProps<{
  activity?: ActivityDto | null
  loading?: boolean
}>()

const emit = defineEmits<{
  close: []
  updated: []
  deleted: []
}>()

const open = ref(true)
const isLocked = import.meta.client ? useScrollLock(document.body) : ref(false)

watch(open, (val) => {
  if (!val) {
    isLocked.value = false
    closeModal()
  }
})

onMounted(() => {
  isLocked.value = true
})

onUnmounted(() => {
  isLocked.value = false
})

const router = useRouter()

function closeModal() {
  if (window.history.length > 1) {
    router.back()
  } else {
    navigateTo('/')
  }
  emit('close')
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
        @updated="emit('updated')"
        @deleted="closeModal"
      />

      <div v-else class="text-center py-12">
        <p class="text-muted mb-4">
          Activity not found
        </p>
        <UButton label="Back to board" to="/" />
      </div>
    </template>
  </UModal>
</template>
