import { useNotifications } from '@/hooks/useNotifications'
import { NotificationItem } from '@/components/notifications/NotificationItem'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Bell, AlertCircle, CheckCheck } from 'lucide-react'

export function NotificationsPage() {
  const { notifications, isLoading, error, markAsRead, markAllAsRead, unreadCount } = useNotifications()

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div className="text-center">
          <h2 className="text-xl font-semibold">Failed to load notifications</h2>
          <p className="text-muted-foreground">
            There was an error loading your notifications. Please try again later.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="mt-2 text-muted-foreground">
            Stay updated with your tournament activities
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={() => markAllAsRead()} variant="outline" className="w-full sm:w-auto">
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all as read ({unreadCount})
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-6 rounded-lg border-2 border-dashed p-8 text-center">
          <Bell className="h-16 w-16 text-muted-foreground" />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">No notifications yet</h2>
            <p className="text-muted-foreground">
              When you receive notifications about tournaments, enrollments, or updates, they'll appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border bg-card">
          <div className="divide-y">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={() => {
                  if (!notification.read) {
                    markAsRead(notification.id)
                  }
                }}
              />
            ))}
          </div>
        </div>
      )}

      {notifications.length > 0 && (
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Showing {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}
