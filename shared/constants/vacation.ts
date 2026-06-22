import { addDays, format, parseISO } from 'date-fns'

export const VACATION_START = '2026-06-27'
export const VACATION_END = '2026-07-04'

export const HOME_BASE = {
  name: 'Molino Della Carpinese',
  address: 'Molino Della Carpinese, Tuscany, Italy',
  latitude: 43.35,
  longitude: 11.25
}

export interface VacationDay {
  date: string
  label: string
  dayOfWeek: string
}

function buildVacationDays(): VacationDay[] {
  const start = parseISO(VACATION_START)
  const days: VacationDay[] = []
  for (let i = 0; i < 8; i++) {
    const d = addDays(start, i)
    days.push({
      date: format(d, 'yyyy-MM-dd'),
      label: format(d, 'MMM d'),
      dayOfWeek: format(d, 'EEE')
    })
  }
  return days
}

export const VACATION_DAYS = buildVacationDays()

export const IDENTITIES = [
  'Frederik',
  'Søren',
  'Marie',
  'Peter',
  'Anna',
  'Lars',
  'Emma',
  'Jonas'
] as const

export type IdentityName = (typeof IDENTITIES)[number]

export const ADMIN_IDENTITY: IdentityName = 'Frederik'

export const ACTIVITY_CATEGORIES = [
  'Culture',
  'Food',
  'Wine',
  'Nature',
  'History',
  'Shopping',
  'Adventure',
  'Relaxation',
  'Event'
] as const

export const ACTIVITY_STATUSES = [
  'Idea',
  'Planned',
  'Booked',
  'Completed'
] as const

export const DRIVE_TIME_FILTERS = [
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '60 min', value: 60 },
  { label: 'Full day', value: 999 }
] as const
