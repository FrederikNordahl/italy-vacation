<script setup lang="ts">
import { da } from '#shared/i18n/da'

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'da'
  }
})

useSeoMeta({
  title: da.appTitle,
  description: da.appDescription,
  ogTitle: da.appTitle,
  ogDescription: da.appDescription
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
