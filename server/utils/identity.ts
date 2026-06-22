import type { UserIdentityName } from '@prisma/client'

const IDENTITY_MAP: Record<string, UserIdentityName> = {
  Frederik: 'Frederik',
  Søren: 'Soren',
  Soren: 'Soren',
  Marie: 'Marie',
  Peter: 'Peter',
  Anna: 'Anna',
  Lars: 'Lars',
  Emma: 'Emma',
  Jonas: 'Jonas'
}

const DISPLAY_MAP: Record<UserIdentityName, string> = {
  Frederik: 'Frederik',
  Soren: 'Søren',
  Marie: 'Marie',
  Peter: 'Peter',
  Anna: 'Anna',
  Lars: 'Lars',
  Emma: 'Emma',
  Jonas: 'Jonas'
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
