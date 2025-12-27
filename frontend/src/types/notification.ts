export interface Notification {
  id: number
  userId: number
  type: 'enrollment_approved' | 'enrollment_rejected' | 'tournament_update' | 'tournament_reminder' | 'general'
  title: string
  message: string
  read: boolean
  relatedEntityType?: 'tournament' | 'enrollment'
  relatedEntityId?: number
  createdAt: string
  updatedAt: string
}

export interface NotificationListResponse {
  notifications: Notification[]
  total: number
  unreadCount: number
}

export interface MarkAsReadRequest {
  notificationId: number
}
