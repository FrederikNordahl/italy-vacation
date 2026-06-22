<script setup lang="ts">
import { HOME_BASE, VACATION_START, VACATION_END } from '#shared/constants/vacation'
import { format, parseISO } from 'date-fns'
import { da as daLocale } from 'date-fns/locale'
import { da } from '#shared/i18n/da'

const { identity, showPicker } = useIdentity()

const vacationLabel = computed(() => {
  const start = format(parseISO(VACATION_START), 'd. MMM', { locale: daLocale })
  const end = format(parseISO(VACATION_END), 'd. MMM yyyy', { locale: daLocale })
  return `${start} – ${end}`
})

onMounted(() => {
  if (!identity.value) {
    showPicker.value = true
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-olive-50/60 dark:bg-default">
    <header class="sticky top-0 z-40 border-b border-default bg-default/95 backdrop-blur-lg shadow-sm">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-4">
        <NuxtLink to="/" class="flex items-center gap-3 min-w-0">
          <div class="flex size-10 sm:size-11 items-center justify-center rounded-xl bg-primary/10 shrink-0">
            <UIcon name="i-lucide-palmtree" class="size-5 sm:size-6 text-primary" />
          </div>
          <div class="min-w-0">
            <p class="font-bold text-lg sm:text-xl leading-tight truncate">
              {{ da.appTitle }}
            </p>
            <p class="text-sm text-muted truncate">
              {{ vacationLabel }}
            </p>
          </div>
        </NuxtLink>

        <div class="flex items-center gap-2 shrink-0">
          <IdentitySwitcher />
          <UColorModeButton size="md" />
        </div>
      </div>
    </header>

    <main class="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <slot />
    </main>

    <footer class="border-t border-default bg-default/80 py-4 px-4 text-center text-sm">
      <a
        :href="HOME_BASE.mapsUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center justify-center gap-1.5 max-w-full text-muted hover:text-primary transition-colors"
        :aria-label="`${da.openMaps}: ${HOME_BASE.name}`"
      >
        <UIcon name="i-lucide-map-pin" class="size-4 shrink-0" />
        <span class="truncate">{{ HOME_BASE.name }}</span>
        <UIcon name="i-lucide-external-link" class="size-3.5 shrink-0 opacity-60" />
      </a>
    </footer>

    <IdentityPicker />
    <ActivityDetailModal />
  </div>
</template>
