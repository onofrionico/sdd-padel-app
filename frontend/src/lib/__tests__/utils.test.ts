import { describe, it, expect } from 'vitest'
import { formatDate, formatCategory, formatTournamentStatus, formatEnrollmentStatus } from '../utils'

describe('Utils', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15')
      const formatted = formatDate(date)
      expect(formatted).toBeTruthy()
      expect(typeof formatted).toBe('string')
    })
  })

  describe('formatCategory', () => {
    it('should format category 1 correctly', () => {
      expect(formatCategory(1)).toBe('1ra Categoría')
    })

    it('should format category 3 correctly', () => {
      expect(formatCategory(3)).toBe('3ra Categoría')
    })

    it('should format category 5 correctly', () => {
      expect(formatCategory(5)).toBe('5ta Categoría')
    })

    it('should handle unknown category', () => {
      expect(formatCategory(99)).toBe('Categoría 99')
    })
  })

  describe('formatTournamentStatus', () => {
    it('should format upcoming status', () => {
      expect(formatTournamentStatus('upcoming')).toBe('Próximo')
    })

    it('should format in_progress status', () => {
      expect(formatTournamentStatus('in_progress')).toBe('En Progreso')
    })

    it('should format completed status', () => {
      expect(formatTournamentStatus('completed')).toBe('Completado')
    })

    it('should format cancelled status', () => {
      expect(formatTournamentStatus('cancelled')).toBe('Cancelado')
    })

    it('should return original status if unknown', () => {
      expect(formatTournamentStatus('unknown')).toBe('unknown')
    })
  })

  describe('formatEnrollmentStatus', () => {
    it('should format pending status', () => {
      expect(formatEnrollmentStatus('pending')).toBe('Pendiente')
    })

    it('should format approved status', () => {
      expect(formatEnrollmentStatus('approved')).toBe('Aprobado')
    })

    it('should format rejected status', () => {
      expect(formatEnrollmentStatus('rejected')).toBe('Rechazado')
    })
  })
})
