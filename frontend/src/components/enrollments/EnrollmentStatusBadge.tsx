import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface EnrollmentStatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn'
  className?: string
}

export function EnrollmentStatusBadge({ status, className }: EnrollmentStatusBadgeProps) {
  const statusConfig = {
    pending: {
      label: 'Pending Approval',
      variant: 'outline' as const,
      className: 'border-yellow-500 text-yellow-700 bg-yellow-50',
    },
    approved: {
      label: 'Approved',
      variant: 'default' as const,
      className: 'bg-green-500 text-white hover:bg-green-600',
    },
    rejected: {
      label: 'Rejected',
      variant: 'destructive' as const,
      className: 'bg-red-500 text-white hover:bg-red-600',
    },
    withdrawn: {
      label: 'Withdrawn',
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
