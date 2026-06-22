<script setup lang="ts">
const props = defineProps<{
  activityId: string
  voteScore: number
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
  const apiName = identity.value === 'Søren' ? 'Soren' : identity.value
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
    <div class="flex items-center justify-between">
      <h3 class="font-semibold text-sm">
        Votes
      </h3>
      <UBadge
        :color="voteScore > 0 ? 'success' : voteScore < 0 ? 'error' : 'neutral'"
        variant="subtle"
      >
        Score: {{ voteScore }}
      </UBadge>
    </div>

    <div class="flex gap-2">
      <UButton
        icon="i-lucide-thumbs-up"
        :color="myVote?.value === 1 ? 'success' : 'neutral'"
        :variant="myVote?.value === 1 ? 'solid' : 'outline'"
        :loading="loading"
        @click="castVote(1)"
      />
      <UButton
        icon="i-lucide-thumbs-down"
        :color="myVote?.value === -1 ? 'error' : 'neutral'"
        :variant="myVote?.value === -1 ? 'solid' : 'outline'"
        :loading="loading"
        @click="castVote(-1)"
      />
    </div>

    <div v-if="upvotes.length" class="text-xs">
      <span class="text-muted">Upvoted by:</span>
      {{ upvotes.map(v => v.displayName).join(', ') }}
    </div>
    <div v-if="downvotes.length" class="text-xs">
      <span class="text-muted">Downvoted by:</span>
      {{ downvotes.map(v => v.displayName).join(', ') }}
    </div>
  </div>
</template>
