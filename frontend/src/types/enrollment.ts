export interface Enrollment {
  id: number
  tournamentId: number
  player1Id: number
  player2Id: number
  category: number
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

export interface EnrollmentRequest {
  tournamentId: number
  partnerId: number
  category: number
}

export interface EnrollmentWithDetails extends Enrollment {
  tournament: {
    id: number
    name: string
    startDate: string
    location: string
  }
  player1: {
    id: number
    fullName: string
  }
  player2: {
    id: number
    fullName: string
  }
}
