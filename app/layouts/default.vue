<script setup lang="ts">
import { HOME_BASE, VACATION_START, VACATION_END } from '../../shared/constants/vacation'
import { format, parseISO } from 'date-fns'

const navItems = [
  { label: 'Board', to: '/', icon: 'i-lucide-layout-grid' },
  { label: 'Ranking', to: '/ranking', icon: 'i-lucide-trophy' },
  { label: 'Itinerary', to: '/itinerary', icon: 'i-lucide-list-checks' }
]

const vacationLabel = computed(() => {
  const start = format(parseISO(VACATION_START), 'MMM d')
  const end = format(parseISO(VACATION_END), 'MMM d, yyyy')
  return `${start} – ${end}`
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="sticky top-0 z-40 border-b border-default bg-default/80 backdrop-blur-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div class="flex items-center gap-4 min-w-0">
          <NuxtLink to="/" class="flex items-center gap-2 shrink-0">
            <UIcon name="i-lucide-palmtree" class="size-6 text-primary" />
            <div class="hidden sm:block">
              <p class="font-bold text-sm leading-tight">
                Tuscany 2026
              </p>
              <p class="text-xs text-muted">
                {{ vacationLabel }}
              </p>
            </div>
          </NuxtLink>

          <nav class="hidden md:flex items-center gap-1">
            <UButton
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              :label="item.label"
              :icon="item.icon"
              color="neutral"
              variant="ghost"
              size="sm"
            />
          </nav>
        </div>

        <div class="flex items-center gap-2">
          <IdentitySwitcher />
          <UColorModeButton />
        </div>
      </div>

      <nav class="md:hidden border-t border-default px-4 py-2 flex gap-1 overflow-x-auto">
        <UButton
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :label="item.label"
          :icon="item.icon"
          color="neutral"
          variant="ghost"
          size="xs"
        />
      </nav>
    </header>

    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
      <slot />
    </main>

    <footer class="border-t border-default py-4 px-4 text-center text-xs text-muted">
      <p class="flex items-center justify-center gap-1">
        <UIcon name="i-lucide-home" class="size-3" />
        Home base: {{ HOME_BASE.name }} — {{ HOME_BASE.address }}
      </p>
    </footer>

    <IdentityPicker />
  </div>
</template>
