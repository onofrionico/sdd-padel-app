import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { Payment } from '../../types/payment.types';
import { paymentsService } from '../../services/payments.service';
import { Clock, CreditCard, Users, User, ExternalLink } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

interface PaymentCardProps {
  payment: Payment;
  onPaymentClick?: () => void;
  showActions?: boolean;
}

export const PaymentCard: React.FC<PaymentCardProps> = ({
  payment,
  onPaymentClick,
  showActions = true,
}) => {
  const { t } = useTranslation();

  const timeRemaining = paymentsService.getTimeRemaining(payment.expiresAt);
  const isExpired = paymentsService.isPaymentExpired(payment.expiresAt);
  const formattedTime = paymentsService.formatTimeRemaining(timeRemaining);

  const handlePayNow = () => {
    if (payment.paymentUrl) {
      window.open(payment.paymentUrl, '_blank');
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              {t('payments.paymentFor')} {payment.metadata?.tournamentName || t('payments.tournament')}
            </CardTitle>
            <CardDescription className="mt-1">
              {payment.paymentType === 'full_team' ? (
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {t('payments.type.fullTeam')}
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {t('payments.type.split')}
                </span>
              )}
            </CardDescription>
          </div>
          <PaymentStatusBadge status={payment.status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Amount */}
        <div className="flex justify-between items-center py-2 border-b">
          <span className="text-sm text-muted-foreground">{t('payments.amount')}</span>
          <span className="text-lg font-semibold">
            {formatCurrency(payment.amount, payment.currency)}
          </span>
        </div>

        {/* Platform Fee */}
        {payment.platformFee > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">{t('payments.platformFee')}</span>
            <span>{formatCurrency(payment.platformFee, payment.currency)}</span>
          </div>
        )}

        {/* Deadline */}
        {payment.status === 'pending' && !isExpired && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
            <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                {t('payments.timeRemaining')}
              </p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400">{formattedTime}</p>
            </div>
          </div>
        )}

        {/* Expired */}
        {isExpired && payment.status === 'pending' && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              {t('payments.expired')}
            </p>
          </div>
        )}

        {/* Completed */}
        {payment.status === 'completed' && payment.paidAt && (
          <div className="text-sm text-muted-foreground">
            {t('payments.paidOn')}{' '}
            {new Date(payment.paidAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        )}

        {/* Actions */}
        {showActions && payment.status === 'pending' && !isExpired && (
          <div className="flex gap-2 pt-2">
            <Button onClick={handlePayNow} className="flex-1" disabled={!payment.paymentUrl}>
              <ExternalLink className="w-4 h-4 mr-2" />
              {t('payments.payNow')}
            </Button>
          </div>
        )}

        {showActions && onPaymentClick && (
          <Button variant="outline" onClick={onPaymentClick} className="w-full">
            {t('payments.viewDetails')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
