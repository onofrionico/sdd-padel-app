export interface Enrollment {
  id: number
  tournamentId: string
  player1Id: number
  player2Id: number
  category: number
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

export interface EnrollmentRequest {
  tournamentId: string
  partnerId: number
  category: number
}

export interface EnrollmentWithDetails extends Enrollment {
  tournament: {
    id: string
    name: string
    startDate: string
    location: string
  }
  player1: {
    id: number
    firstName: string
    lastName: string
    email: string
    fullName: string
  }
  player2: {
    id: number
    firstName: string
    lastName: string
    email: string
    fullName: string
  }
}
