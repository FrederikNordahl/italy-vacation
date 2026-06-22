export function useActivityModal() {
  const route = useRoute()
  const router = useRouter()

  const activityId = computed(() => {
    const id = route.query.activity
    return typeof id === 'string' && id.length > 0 ? id : null
  })

  const isOpen = computed(() => activityId.value !== null)

  function open(id: string) {
    router.replace({
      path: route.path,
      query: { ...route.query, activity: id }
    })
  }

  function close() {
    const query = { ...route.query }
    delete query.activity
    router.replace({ path: route.path, query })
  }

  return { activityId, isOpen, open, close }
}
