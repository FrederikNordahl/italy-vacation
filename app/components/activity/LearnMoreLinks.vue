<script setup lang="ts">
import type { ActivityLinkDto } from '#shared/types/activity'
import { da } from '#shared/i18n/da'

defineProps<{
  links: ActivityLinkDto[]
}>()
</script>

<template>
  <div v-if="links.length" class="space-y-2">
    <h3 class="font-semibold text-sm">
      {{ da.learnMore }}
    </h3>
    <div class="flex flex-wrap gap-2">
      <UButton
        v-for="link in links"
        :key="link.id"
        :to="link.url"
        target="_blank"
        :label="link.title"
        icon="i-lucide-external-link"
        color="neutral"
        variant="outline"
        size="sm"
      />
    </div>
  </div>
</template>
