import {
  IDENTITIES,
  ADMIN_IDENTITY,
  type IdentityName
} from '../../shared/constants/vacation'

const DISPLAY_MAP: Record<string, string> = {
  Soren: 'Søren'
}

export function displayIdentity(name: string): string {
  return DISPLAY_MAP[name] ?? name
}

export function toApiIdentity(name: IdentityName): string {
  return name === 'Søren' ? 'Søren' : name
}

export function useIdentity() {
  const identity = useLocalStorage<IdentityName | null>('vacation-user', null)
  const showPicker = useState('identity-picker-open', () => false)

  const isAdmin = computed(() => identity.value === ADMIN_IDENTITY)
  const displayName = computed(() =>
    identity.value ? displayIdentity(identity.value) : null
  )

  function setIdentity(name: IdentityName) {
    identity.value = name
    showPicker.value = false
  }

  function requireIdentity(): boolean {
    if (!identity.value) {
      showPicker.value = true
      return false
    }
    return true
  }

  function openPicker() {
    showPicker.value = true
  }

  return {
    identity,
    displayName,
    isAdmin,
    showPicker,
    identities: IDENTITIES,
    setIdentity,
    requireIdentity,
    openPicker
  }
}
