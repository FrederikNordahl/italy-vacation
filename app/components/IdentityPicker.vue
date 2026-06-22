<script setup lang="ts">
import type { IdentityName } from '../../shared/constants/vacation'

const { showPicker, identities, setIdentity } = useIdentity()

const open = computed({
  get: () => showPicker.value,
  set: (v: boolean) => { showPicker.value = v }
})
</script>

<template>
  <UModal
    v-model:open="open"
    :dismissible="false"
    title="Who are you?"
    description="Pick your name so we know who's voting and commenting."
  >
    <template #body>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <UButton
          v-for="name in identities"
          :key="name"
          :label="name"
          color="primary"
          variant="soft"
          size="lg"
          block
          class="justify-center"
          @click="setIdentity(name as IdentityName)"
        />
      </div>
    </template>
  </UModal>
</template>
