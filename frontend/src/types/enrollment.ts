export interface Enrollment {
  id: string
  tournamentId: string
  teamId: string
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn'
  rejectionReason?: string | null
  registeredAt: string
  updatedAt: string
}

export interface EnrollmentRequest {
  tournamentId: string
  partnerId: string
  teamName?: string
}

export interface EnrollmentWithDetails extends Enrollment {
  tournament: {
    id: string
    name: string
    startDate: string
    endDate: string
    status: string
    type: string
    description?: string
  }
  team: {
    id: string
    name: string
    players: Array<{
      id: string
      userId: string
      category: number
      user: {
        id: string
        email: string
        firstName: string
        lastName: string
      }
    }>
  }
}
