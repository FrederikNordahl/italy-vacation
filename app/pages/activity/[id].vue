<script setup lang="ts">
const route = useRoute()

await navigateTo(
  { path: '/', query: { activity: route.params.id as string } },
  { replace: true }
)
</script>
