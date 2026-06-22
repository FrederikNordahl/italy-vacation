import { addDays, format, parseISO } from 'date-fns'
import { da } from 'date-fns/locale'

export const VACATION_START = '2026-06-27'
export const VACATION_END = '2026-07-04'

export const HOME_BASE = {
  name: 'Molino Della Carpinese',
  address: 'Molino Della Carpinese, Toscana, Italien',
  latitude: 43.35,
  longitude: 11.25,
  mapsUrl: 'https://maps.google.com/?q=Molino+Della+Carpinese'
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
      label: format(d, 'd. MMM', { locale: da }),
      dayOfWeek: format(d, 'EEEE', { locale: da })
    })
  }
  return days
}

export const VACATION_DAYS = buildVacationDays()

export const IDENTITIES = [
  'Anja',
  'Per',
  'Sarah',
  'Frederik',
  'Joan',
  'Jane',
  'Søren',
  'Esther'
] as const

export type IdentityName = (typeof IDENTITIES)[number]

export const ADMIN_IDENTITY: IdentityName = 'Frederik'

export const ACTIVITY_CATEGORIES = [
  'Wine',
  'Food',
  'Sightseeing',
  'Nature',
  'Swimming',
  'Historic',
  'Event',
  'Relaxation',
  'Other'
] as const

export type ActivityCategory = (typeof ACTIVITY_CATEGORIES)[number]

export const ACTIVITY_STATUSES = [
  'Idea',
  'Planned',
  'Booked',
  'Completed'
] as const

export type ActivityStatus = (typeof ACTIVITY_STATUSES)[number]

export const DRIVE_TIME_FILTERS = [
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '60 min', value: 60 },
  { label: 'Hele dagen', value: 999 }
] as const
