<script setup lang="ts">
import type { IdentityName } from '#shared/constants/vacation'
import { da } from '#shared/i18n/da'

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
    :title="da.whoAreYou"
    :description="da.whoAreYouDesc"
    :ui="{ content: 'sm:max-w-lg' }"
  >
    <template #body>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <UButton
          v-for="name in identities"
          :key="name"
          :label="name"
          color="primary"
          variant="soft"
          size="xl"
          block
          class="justify-center font-semibold"
          @click="setIdentity(name as IdentityName)"
        />
      </div>
    </template>
  </UModal>
</template>
