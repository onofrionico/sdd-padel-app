import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { NotificationItem } from './NotificationItem'
import { useNotifications } from '@/hooks/useNotifications'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { CheckCheck, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NotificationDropdownProps {
  isOpen: boolean
  onClose: () => void
  triggerRef: React.RefObject<HTMLElement>
}

export function NotificationDropdown({ isOpen, onClose, triggerRef }: NotificationDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { notifications, isLoading, markAsRead, markAllAsRead, unreadCount } = useNotifications()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose, triggerRef])

  if (!isOpen) return null

  const recentNotifications = notifications.slice(0, 5)

  return (
    <div
      ref={dropdownRef}
      className={cn(
        'absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-lg border bg-background shadow-lg z-50',
        'animate-in fade-in-0 zoom-in-95 slide-in-from-top-2'
      )}
    >
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="font-semibold">Notifications</h3>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => markAllAsRead()}
            className="h-8 text-xs"
          >
            <CheckCheck className="mr-1 h-3 w-3" />
            Mark all read
          </Button>
        )}
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <LoadingSpinner />
          </div>
        ) : recentNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Bell className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          <>
            {recentNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={() => {
                  if (!notification.read) {
                    markAsRead(notification.id)
                  }
                  onClose()
                }}
              />
            ))}
          </>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="border-t p-3">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="w-full"
            onClick={onClose}
          >
            <Link to="/notifications">View all notifications</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
