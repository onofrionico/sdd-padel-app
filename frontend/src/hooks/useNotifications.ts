import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notificationsApi } from '@/services/api/notifications'
import { useToast } from './useToast'

export const useNotifications = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const notificationsQuery = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsApi.getNotifications,
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 30,
  })

  const markAsReadMutation = useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to mark notification as read.',
        variant: 'destructive',
      })
    },
  })

  const markAllAsReadMutation = useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      toast({
        title: 'Success',
        description: 'All notifications marked as read.',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to mark all notifications as read.',
        variant: 'destructive',
      })
    },
  })

  return {
    notifications: notificationsQuery.data?.notifications || [],
    unreadCount: notificationsQuery.data?.unreadCount || 0,
    total: notificationsQuery.data?.total || 0,
    isLoading: notificationsQuery.isLoading,
    error: notificationsQuery.error,
    markAsRead: (notificationId: number) => markAsReadMutation.mutate(notificationId),
    markAllAsRead: () => markAllAsReadMutation.mutate(),
    isMarkingAsRead: markAsReadMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
  }
}
