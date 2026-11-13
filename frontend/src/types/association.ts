export interface Association {
  id: string
  name: string
  description?: string
  logoUrl?: string
  website?: string
  isActive: boolean
  pointsByRound: Record<string, number>
  createdAt: string
  updatedAt: string
}

export interface AssociationMembership {
  id: string
  userId: string
  associationId: string
  role: 'admin' | 'organizer' | 'member'
  category?: number
  points: number
  joinedAt: string
  updatedAt: string
  association?: Association
}

export interface CreateMembershipRequest {
  userId: string
  role: 'admin' | 'organizer' | 'member'
  category?: number
}

export interface UpdateCategoryRequest {
  category: number
}

export interface AssociationWithMembership extends Association {
  membership?: AssociationMembership
}
