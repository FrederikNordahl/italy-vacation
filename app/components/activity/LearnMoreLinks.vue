<script setup lang="ts">
import type { ActivityLinkDto } from '../../../shared/types/activity'

defineProps<{
  links: ActivityLinkDto[]
}>()
</script>

<template>
  <div v-if="links.length" class="space-y-2">
    <h3 class="font-semibold text-sm">
      Learn more
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
