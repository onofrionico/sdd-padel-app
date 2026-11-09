import { apiClient } from './client'
import { Notification, NotificationListResponse } from '@/types/notification'

export const notificationsApi = {
  getNotifications: async (): Promise<NotificationListResponse> => {
    const response = await apiClient.get<Notification[]>('/notifications')
    const notifications = response.data ?? []
    return {
      notifications,
      total: notifications.length,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    }
  },

  markAsRead: async (notificationId: string): Promise<Notification> => {
    const response = await apiClient.put<Notification>(`/notifications/${notificationId}/read`)
    return response.data
  },

  markAllAsRead: async (): Promise<number> => {
    const response = await apiClient.put<{ updated: number }>('/notifications/read-all')
    return response.data.updated
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get<{ count: number }>('/notifications/unread-count')
    return response.data.count
  },
}
