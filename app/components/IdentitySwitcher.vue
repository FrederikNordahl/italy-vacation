<script setup lang="ts">
import type { IdentityName } from '../../shared/constants/vacation'

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
    <UBadge v-if="isAdmin" color="primary" variant="subtle" size="sm">
      Admin
    </UBadge>
    <UDropdownMenu :items="[items]">
      <UButton
        :label="displayName ?? 'Select identity'"
        icon="i-lucide-user"
        color="neutral"
        variant="ghost"
        trailing-icon="i-lucide-chevron-down"
        @click="!identity && openPicker()"
      />
    </UDropdownMenu>
  </div>
</template>
