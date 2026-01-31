import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { Payment, PaymentDashboardStats } from '../../types/payment.types';
import { paymentsService } from '../../services/payments.service';
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

interface PaymentDashboardProps {
  tournamentId: string;
}

export const PaymentDashboard: React.FC<PaymentDashboardProps> = ({ tournamentId }) => {
  const { t } = useTranslation();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadPayments();
  }, [tournamentId]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const data = await paymentsService.getTournamentPayments(tournamentId);
      setPayments(data);
      setStats(paymentsService.calculatePaymentStats(data));
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPayments = (status?: string) => {
    if (!status || status === 'all') return payments;
    return payments.filter((p) => p.status === status);
  };

  const filteredPayments = filterPayments(activeTab);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Revenue */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('payments.dashboard.totalRevenue')}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.totalRevenue, 'ARS')}
              </div>
              <p className="text-xs text-muted-foreground">
                {t('payments.dashboard.netRevenue')}: {formatCurrency(stats.netRevenue, 'ARS')}
              </p>
            </CardContent>
          </Card>

          {/* Completed Payments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('payments.dashboard.completedPayments')}
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedPayments}</div>
              <p className="text-xs text-muted-foreground">
                {t('payments.dashboard.outOf')} {stats.totalPayments}
              </p>
            </CardContent>
          </Card>

          {/* Pending Payments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('payments.dashboard.pendingPayments')}
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingPayments}</div>
              <p className="text-xs text-muted-foreground">
                {t('payments.dashboard.awaitingPayment')}
              </p>
            </CardContent>
          </Card>

          {/* Average Payment */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('payments.dashboard.averagePayment')}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.averagePaymentAmount, 'ARS')}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.teamPaymentCount} {t('payments.type.fullTeam')} / {stats.splitPaymentCount}{' '}
                {t('payments.type.split')}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Payments List */}
      <Card>
        <CardHeader>
          <CardTitle>{t('payments.dashboard.paymentsList')}</CardTitle>
          <CardDescription>{t('payments.dashboard.paymentsListDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">
                {t('payments.dashboard.all')} ({payments.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                {t('payments.status.pending')} ({stats?.pendingPayments || 0})
              </TabsTrigger>
              <TabsTrigger value="completed">
                {t('payments.status.completed')} ({stats?.completedPayments || 0})
              </TabsTrigger>
              <TabsTrigger value="failed">
                {t('payments.status.failed')} ({stats?.failedPayments || 0})
              </TabsTrigger>
              <TabsTrigger value="refunded">
                {t('payments.status.refunded')} (
                {payments.filter((p) => p.status === 'refunded').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4 mt-4">
              {filteredPayments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>{t('payments.dashboard.noPayments')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredPayments.map((payment) => (
                    <PaymentListItem key={payment.id} payment={payment} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

interface PaymentListItemProps {
  payment: Payment;
}

const PaymentListItem: React.FC<PaymentListItemProps> = ({ payment }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <p className="font-medium">
            {payment.metadata?.playerName || t('payments.player')}
            {payment.paymentType === 'full_team' && (
              <span className="text-sm text-muted-foreground ml-2">
                ({t('payments.type.fullTeam')})
              </span>
            )}
          </p>
          <PaymentStatusBadge status={payment.status} />
        </div>
        <p className="text-sm text-muted-foreground">
          {new Date(payment.createdAt).toLocaleDateString()} •{' '}
          {payment.paymentGateway.toUpperCase()}
        </p>
      </div>
      <div className="text-right space-y-1">
        <p className="font-semibold">{formatCurrency(payment.amount, payment.currency)}</p>
        {payment.status === 'pending' && !paymentsService.isPaymentExpired(payment.expiresAt) && (
          <p className="text-xs text-yellow-600">
            {t('payments.expires')}{' '}
            {paymentsService.formatTimeRemaining(
              paymentsService.getTimeRemaining(payment.expiresAt)
            )}
          </p>
        )}
      </div>
    </div>
  );
};
