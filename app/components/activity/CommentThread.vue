<script setup lang="ts">
const props = defineProps<{
  activityId: string
}>()

const emit = defineEmits<{
  commented: []
}>()

const { identity, requireIdentity } = useIdentity()

interface CommentItem {
  id: string
  userName: string
  displayName: string
  message: string
  createdAt: string
}

const comments = ref<CommentItem[]>([])
const message = ref('')
const loading = ref(false)

async function loadComments() {
  comments.value = await $fetch(`/api/comments?activityId=${props.activityId}`)
}

onMounted(loadComments)
watch(() => props.activityId, loadComments)

async function submitComment() {
  if (!message.value.trim() || !requireIdentity() || !identity.value) return
  loading.value = true
  try {
    const comment = await $fetch('/api/comments', {
      method: 'POST',
      body: {
        activityId: props.activityId,
        userName: identity.value,
        message: message.value.trim()
      }
    })
    comments.value.push(comment as CommentItem)
    message.value = ''
    emit('commented')
  } finally {
    loading.value = false
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div class="space-y-4">
    <h3 class="font-semibold text-sm">
      Comments ({{ comments.length }})
    </h3>

    <div class="space-y-3 max-h-60 overflow-y-auto">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="rounded-lg bg-elevated/50 p-3 text-sm"
      >
        <div class="flex items-center justify-between mb-1">
          <span class="font-medium">{{ comment.displayName }}</span>
          <span class="text-xs text-muted">{{ formatDate(comment.createdAt) }}</span>
        </div>
        <p class="text-muted">
          {{ comment.message }}
        </p>
      </div>
      <p v-if="!comments.length" class="text-sm text-muted">
        No comments yet. Be the first!
      </p>
    </div>

    <form class="flex gap-2" @submit.prevent="submitComment">
      <UInput
        v-model="message"
        placeholder="Add a comment..."
        class="flex-1"
      />
      <UButton
        type="submit"
        icon="i-lucide-send"
        :loading="loading"
        :disabled="!message.trim()"
      />
    </form>
  </div>
</template>
