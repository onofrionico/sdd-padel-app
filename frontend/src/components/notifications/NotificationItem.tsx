import { Notification } from '@/types/notification'
import { formatDistanceToNow } from 'date-fns'
import { es, enUS } from 'date-fns/locale'
import { 
  CheckCircle, 
  XCircle, 
  Info, 
  Calendar, 
  Bell 
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

interface NotificationItemProps {
  notification: Notification
  onClick?: () => void
  className?: string
}

export function NotificationItem({ notification, onClick, className }: NotificationItemProps) {
  const { t, i18n } = useTranslation()
  
  const getIcon = () => {
    switch (notification.type) {
      case 'payment_confirmed':
      case 'team_payment_completed':
      case 'refund_processed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'payment_failed':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'tournament_update':
      case 'match_result':
        return <Info className="h-5 w-5 text-blue-500" />
      case 'match_scheduled':
      case 'payment_required':
      case 'payment_deadline_reminder_24h':
      case 'payment_deadline_reminder_12h':
      case 'payment_deadline_reminder_2h':
        return <Calendar className="h-5 w-5 text-orange-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  // El backend manda messageKey + messageParams; si no hay traducción, se muestra su texto original
  const getMessage = (): string => {
    const key = notification.metadata?.messageKey
    if (!key) return notification.message
    return String(t(`notification.messages.${key}`, {
      ...(notification.metadata?.messageParams ?? {}),
      defaultValue: notification.message,
    }))
  }

  const getTimeAgo = () => {
    try {
      const locale = i18n.language === 'es' ? es : enUS
      return formatDistanceToNow(new Date(notification.createdAt), {
        addSuffix: true,
        locale,
      })
    } catch {
      return t('notification.timeAgo.justNow')
    }
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex gap-3 p-4 transition-colors hover:bg-accent cursor-pointer border-b last:border-b-0',
        !notification.isRead && 'bg-primary/5',
        className
      )}
    >
      <div className="flex-shrink-0 mt-1">{getIcon()}</div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className={cn(
            'text-sm font-medium',
            !notification.isRead && 'font-semibold'
          )}>
            {t(`notification.type.${notification.type}`, { defaultValue: t('notification.type.general') })}
          </h4>
          {!notification.isRead && (
            <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
          )}
        </div>
        
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {getMessage()}
        </p>
        
        <p className="mt-1 text-xs text-muted-foreground">
          {getTimeAgo()}
        </p>
      </div>
    </div>
  )
}
