<script setup lang="ts">
import { da } from '#shared/i18n/da'

const props = defineProps<{
  activityId: string
}>()

const emit = defineEmits<{
  voted: []
}>()

const { identity, requireIdentity } = useIdentity()

interface VoteItem {
  id: string
  userName: string
  displayName: string
  value: number
}

const votes = ref<VoteItem[]>([])
const loading = ref(false)

async function loadVotes() {
  votes.value = await $fetch(`/api/votes?activityId=${props.activityId}`)
}

onMounted(loadVotes)
watch(() => props.activityId, loadVotes)

const upvotes = computed(() => votes.value.filter(v => v.value === 1))
const downvotes = computed(() => votes.value.filter(v => v.value === -1))

const myVote = computed(() => {
  if (!identity.value) return null
  const apiName = toApiIdentity(identity.value)
  return votes.value.find(v => v.userName === apiName || v.userName === identity.value)
})

async function castVote(value: 1 | -1) {
  if (!requireIdentity() || !identity.value) return
  loading.value = true
  try {
    await $fetch('/api/votes', {
      method: 'POST',
      body: {
        activityId: props.activityId,
        userName: identity.value,
        value
      }
    })
    await loadVotes()
    emit('voted')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="space-y-3">
    <h3 class="font-semibold text-sm">
      {{ da.votes }}
    </h3>

    <div class="flex gap-4">
      <div class="flex flex-col items-center gap-1">
        <UButton
          icon="i-lucide-thumbs-up"
          :color="myVote?.value === 1 ? 'success' : 'neutral'"
          :variant="myVote?.value === 1 ? 'solid' : 'outline'"
          :loading="loading"
          @click="castVote(1)"
        />
        <span class="text-sm font-semibold tabular-nums text-success">
          {{ upvotes.length }}
        </span>
        <span class="text-xs text-muted">{{ da.voteUp }}</span>
      </div>

      <div class="flex flex-col items-center gap-1">
        <UButton
          icon="i-lucide-thumbs-down"
          :color="myVote?.value === -1 ? 'error' : 'neutral'"
          :variant="myVote?.value === -1 ? 'solid' : 'outline'"
          :loading="loading"
          @click="castVote(-1)"
        />
        <span class="text-sm font-semibold tabular-nums text-error">
          {{ downvotes.length }}
        </span>
        <span class="text-xs text-muted">{{ da.voteDown }}</span>
      </div>
    </div>

    <div v-if="upvotes.length" class="text-xs">
      <span class="text-muted">{{ da.upvotedBy }}</span>
      {{ upvotes.map(v => v.displayName).join(', ') }}
    </div>
    <div v-if="downvotes.length" class="text-xs">
      <span class="text-muted">{{ da.downvotedBy }}</span>
      {{ downvotes.map(v => v.displayName).join(', ') }}
    </div>
  </div>
</template>
