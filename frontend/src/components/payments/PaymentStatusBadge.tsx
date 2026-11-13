import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '../ui/badge';
import { PaymentStatus } from '../../types/payment.types';
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  RefreshCw,
  DollarSign,
} from 'lucide-react';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({
  status,
  className,
}) => {
  const { t } = useTranslation();

  const statusConfig = {
    pending: {
      label: t('payments.status.pending'),
      variant: 'secondary' as const,
      icon: Clock,
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    },
    processing: {
      label: t('payments.status.processing'),
      variant: 'secondary' as const,
      icon: RefreshCw,
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    },
    completed: {
      label: t('payments.status.completed'),
      variant: 'default' as const,
      icon: CheckCircle2,
      className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    },
    failed: {
      label: t('payments.status.failed'),
      variant: 'destructive' as const,
      icon: XCircle,
      className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    },
    refunded: {
      label: t('payments.status.refunded'),
      variant: 'outline' as const,
      icon: DollarSign,
      className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    },
    partially_refunded: {
      label: t('payments.status.partiallyRefunded'),
      variant: 'outline' as const,
      icon: AlertCircle,
      className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={`${config.className} ${className || ''}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
};
