import type { UserIdentityName } from '@prisma/client'

const IDENTITY_MAP: Record<string, UserIdentityName> = {
  Anja: 'Anja',
  Per: 'Per',
  Sarah: 'Sarah',
  Frederik: 'Frederik',
  Joan: 'Joan',
  Jane: 'Jane',
  Søren: 'Soren',
  Soren: 'Soren',
  Esther: 'Esther'
}

const DISPLAY_MAP: Record<UserIdentityName, string> = {
  Anja: 'Anja',
  Per: 'Per',
  Sarah: 'Sarah',
  Frederik: 'Frederik',
  Joan: 'Joan',
  Jane: 'Jane',
  Soren: 'Søren',
  Esther: 'Esther'
}

export function toPrismaIdentity(name: string): UserIdentityName {
  const mapped = IDENTITY_MAP[name]
  if (!mapped) {
    throw createError({ statusCode: 400, statusMessage: `Invalid identity: ${name}` })
  }
  return mapped
}

export function toDisplayIdentity(name: UserIdentityName): string {
  return DISPLAY_MAP[name] ?? name
}
