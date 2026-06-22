import { da, categoryLabel, statusLabel } from '#shared/i18n/da'
import type { ActivityCategory } from '#shared/constants/vacation'

const CATEGORY_COLORS: Record<ActivityCategory, 'primary' | 'warning' | 'info' | 'success' | 'neutral' | 'error'> = {
  Wine: 'primary',
  Food: 'warning',
  Sightseeing: 'info',
  Nature: 'success',
  Swimming: 'info',
  Historic: 'neutral',
  Event: 'error',
  Relaxation: 'neutral',
  Other: 'neutral'
}

export function useDa() {
  function categoryColor(category: ActivityCategory) {
    return CATEGORY_COLORS[category] ?? 'neutral'
  }

  return { da, categoryLabel, statusLabel, categoryColor }
}
