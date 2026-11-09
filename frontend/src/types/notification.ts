// Refleja la entidad `Notification` del backend (backend/src/notifications/entities/notification.entity.ts)

export type NotificationType =
  | 'tournament_invitation'
  | 'team_invitation'
  | 'match_scheduled'
  | 'match_result'
  | 'tournament_update'
  | 'association_invitation'
  | 'payment_required'
  | 'payment_confirmed'
  | 'payment_failed'
  | 'payment_deadline_reminder_24h'
  | 'payment_deadline_reminder_12h'
  | 'payment_deadline_reminder_2h'
  | 'team_payment_completed'
  | 'refund_processed'
  | 'general'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  message: string
  metadata?: Record<string, any> | null
  status: 'unread' | 'read' | 'archived'
  isRead: boolean
  readAt?: string | null
  createdAt: string
}

export interface NotificationListResponse {
  notifications: Notification[]
  total: number
  unreadCount: number
}
