import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatCategory(category: number): string {
  const categories: Record<number, string> = {
    1: '1ra Categoría',
    2: '2da Categoría',
    3: '3ra Categoría',
    4: '4ta Categoría',
    5: '5ta Categoría',
    6: '6ta Categoría',
    7: '7ma Categoría',
    8: '8va Categoría',
  }
  return categories[category] || `Categoría ${category}`
}

export function formatTournamentStatus(status: string): string {
  const statuses: Record<string, string> = {
    upcoming: 'Próximo',
    in_progress: 'En Progreso',
    completed: 'Completado',
    cancelled: 'Cancelado',
  }
  return statuses[status] || status
}

export function formatEnrollmentStatus(status: string): string {
  const statuses: Record<string, string> = {
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
  }
  return statuses[status] || status
}
