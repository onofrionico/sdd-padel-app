import { Notification } from '@/types/notification'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { 
  CheckCircle, 
  XCircle, 
  Info, 
  Calendar, 
  Bell 
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NotificationItemProps {
  notification: Notification
  onClick?: () => void
  className?: string
}

export function NotificationItem({ notification, onClick, className }: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'enrollment_approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'enrollment_rejected':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'tournament_update':
        return <Info className="h-5 w-5 text-blue-500" />
      case 'tournament_reminder':
        return <Calendar className="h-5 w-5 text-orange-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getTimeAgo = () => {
    try {
      return formatDistanceToNow(new Date(notification.createdAt), {
        addSuffix: true,
        locale: es,
      })
    } catch {
      return 'hace un momento'
    }
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex gap-3 p-4 transition-colors hover:bg-accent cursor-pointer border-b last:border-b-0',
        !notification.read && 'bg-primary/5',
        className
      )}
    >
      <div className="flex-shrink-0 mt-1">{getIcon()}</div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className={cn(
            'text-sm font-medium',
            !notification.read && 'font-semibold'
          )}>
            {notification.title}
          </h4>
          {!notification.read && (
            <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
          )}
        </div>
        
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {notification.message}
        </p>
        
        <p className="mt-1 text-xs text-muted-foreground">
          {getTimeAgo()}
        </p>
      </div>
    </div>
  )
}
