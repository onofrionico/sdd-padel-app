import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { PaymentCard, PaymentTypeSelector } from '../../components/payments';
import { paymentsService } from '../../services/payments.service';
import { Payment, PaymentType } from '../../types/payment.types';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

export const PaymentPage: React.FC = () => {
  const { enrollmentId } = useParams<{ enrollmentId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();

  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentType>('full_team');

  useEffect(() => {
    if (enrollmentId) {
      loadPayment();
    }
  }, [enrollmentId]);

  const loadPayment = async () => {
    if (!enrollmentId) return;

    try {
      setLoading(true);
      const existingPayment = await paymentsService.getPaymentByEnrollment(enrollmentId);
      setPayment(existingPayment);
    } catch (error) {
      console.error('Error loading payment:', error);
      toast({
        title: t('error.boundary.title'),
        description: t('error.boundary.description'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePayment = async () => {
    if (!enrollmentId) return;

    try {
      setCreating(true);
      const newPayment = await paymentsService.createPayment({
        enrollmentId,
        paymentType: selectedPaymentType,
      });
      setPayment(newPayment);
      toast({
        title: t('payments.status.pending'),
        description: t('payments.teamPaymentInfo'),
      });
    } catch (error: any) {
      console.error('Error creating payment:', error);
      toast({
        title: t('error.boundary.title'),
        description: error.response?.data?.message || t('error.boundary.description'),
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        {t('notFound.button.back')}
      </Button>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('payments.paymentFor')} {t('payments.tournament')}</h1>
          <p className="text-muted-foreground mt-2">
            {payment
              ? t('payments.viewDetails')
              : t('payments.selectPaymentTypeDescription')}
          </p>
        </div>

        {payment ? (
          <PaymentCard payment={payment} showActions={true} />
        ) : (
          <>
            <PaymentTypeSelector
              selectedType={selectedPaymentType}
              onTypeChange={setSelectedPaymentType}
              amount={5000}
              currency="ARS"
              allowTeamPayment={true}
              allowSplitPayment={true}
            />

            <Card>
              <CardHeader>
                <CardTitle>{t('payments.payNow')}</CardTitle>
                <CardDescription>
                  {selectedPaymentType === 'full_team'
                    ? t('payments.teamPaymentInfo')
                    : t('payments.splitPaymentInfo')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleCreatePayment}
                  disabled={creating}
                  className="w-full"
                  size="lg"
                >
                  {creating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t('common.loading')}
                    </>
                  ) : (
                    t('payments.payNow')
                  )}
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};
