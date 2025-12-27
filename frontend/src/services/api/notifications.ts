import { apiClient } from './client'
import { Notification, NotificationListResponse } from '@/types/notification'
import { ApiResponse } from '@/types/api'

export const notificationsApi = {
  getNotifications: async (): Promise<NotificationListResponse> => {
    const response = await apiClient.get<ApiResponse<NotificationListResponse>>('/notifications')
    return response.data.data
  },

  markAsRead: async (notificationId: number): Promise<Notification> => {
    const response = await apiClient.put<ApiResponse<Notification>>(
      `/notifications/${notificationId}/read`
    )
    return response.data.data
  },

  markAllAsRead: async (): Promise<void> => {
    await apiClient.put('/notifications/read-all')
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get<ApiResponse<{ count: number }>>('/notifications/unread-count')
    return response.data.data.count
  },
}
