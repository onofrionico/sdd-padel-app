import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

interface EnrollmentStatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn'
  className?: string
}

export function EnrollmentStatusBadge({ status, className }: EnrollmentStatusBadgeProps) {
  const { t } = useTranslation()
  const statusConfig = {
    pending: {
      label: t('enrollment.status.pending'),
      variant: 'outline' as const,
      className: 'border-yellow-500 text-yellow-700 bg-yellow-50',
    },
    approved: {
      label: t('enrollment.status.approved'),
      variant: 'default' as const,
      className: 'bg-green-500 text-white hover:bg-green-600',
    },
    rejected: {
      label: t('enrollment.status.rejected'),
      variant: 'destructive' as const,
      className: 'bg-red-500 text-white hover:bg-red-600',
    },
    withdrawn: {
      label: t('enrollment.status.withdrawn'),
      variant: 'outline' as const,
      className: 'border-gray-500 text-gray-700 bg-gray-50',
    },
  }

  const config = statusConfig[status]

  return (
    <Badge variant={config.variant} className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}
