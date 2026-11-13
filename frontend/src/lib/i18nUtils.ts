import i18n from '@/i18n/config'

export function formatCategory(category: number): string {
  return i18n.t(`category.${category}`, { defaultValue: i18n.t('category.default', { number: category }) })
}

export function formatTournamentStatus(status: string): string {
  const statusMap: Record<string, string> = {
    upcoming: 'tournament.status.upcoming',
    registration_open: 'tournament.status.registrationOpen',
    in_progress: 'tournament.status.inProgress',
    completed: 'tournament.status.completed',
    cancelled: 'tournament.status.cancelled',
  }
  return i18n.t(statusMap[status] || status)
}

export function formatEnrollmentStatus(status: string): string {
  const statusMap: Record<string, string> = {
    pending: 'enrollment.status.pending',
    approved: 'enrollment.status.approved',
    rejected: 'enrollment.status.rejected',
    withdrawn: 'enrollment.status.withdrawn',
  }
  return i18n.t(statusMap[status] || status)
}

/** Formato del torneo traducido ("double_elimination" → "Eliminación Doble"). */
export function formatTournamentType(type?: string | null): string {
  if (!type) return ''
  const key = type.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase()) // double_elimination → doubleElimination
  return i18n.t(`tournament.form.type.${key}`, { defaultValue: type.replace(/_/g, ' ') })
}
