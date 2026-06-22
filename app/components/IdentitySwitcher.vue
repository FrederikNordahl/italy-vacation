<script setup lang="ts">
import type { IdentityName } from '#shared/constants/vacation'
import { da } from '#shared/i18n/da'

const { identity, displayName, isAdmin, identities, setIdentity, openPicker } = useIdentity()

const items = computed(() =>
  identities.map(name => ({
    label: name,
    icon: name === identity.value ? 'i-lucide-check' : undefined,
    onSelect: () => setIdentity(name as IdentityName)
  }))
)
</script>

<template>
  <div class="flex items-center gap-2">
    <UBadge v-if="isAdmin" color="primary" variant="subtle">
      Admin
    </UBadge>
    <UDropdownMenu :items="[items]">
      <UButton
        :label="displayName ?? da.selectIdentity"
        icon="i-lucide-user"
        color="neutral"
        variant="outline"
        size="md"
        trailing-icon="i-lucide-chevron-down"
        @click="!identity && openPicker()"
      />
    </UDropdownMenu>
  </div>
</template>
