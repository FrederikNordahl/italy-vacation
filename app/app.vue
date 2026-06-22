<script setup lang="ts">
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  title: 'Tuscany Vacation Planner 2026',
  description: 'Plan our Tuscany vacation — Jun 27 to Jul 4, 2026. Board, calendar, votes, and itinerary.',
  ogTitle: 'Tuscany Vacation Planner 2026',
  ogDescription: 'Plan our Tuscany vacation with board, calendar, votes, and itinerary.'
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
