<script setup lang="ts">
definePageMeta({
  pageTransition: {
    name: 'modal',
    mode: 'out-in'
  }
})
</script>

<template>
  <div class="min-h-screen bg-default/50 backdrop-blur-sm">
    <slot />
  </div>
</template>

<style>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
