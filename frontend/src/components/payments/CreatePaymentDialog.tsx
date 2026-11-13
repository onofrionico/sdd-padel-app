import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { PaymentTypeSelector } from './PaymentTypeSelector';
import { PaymentType, PaymentSettings } from '../../types/payment.types';
import { paymentsService } from '../../services/payments.service';
import { Loader2 } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

interface CreatePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enrollmentId: string;
  paymentSettings: PaymentSettings;
  onPaymentCreated?: (paymentUrl: string) => void;
}

export const CreatePaymentDialog: React.FC<CreatePaymentDialogProps> = ({
  open,
  onOpenChange,
  enrollmentId,
  paymentSettings,
  onPaymentCreated,
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<PaymentType>('full_team');
  const [creating, setCreating] = useState(false);

  const handleCreatePayment = async () => {
    try {
      setCreating(true);
      const payment = await paymentsService.createPayment({
        enrollmentId,
        paymentType: selectedType,
      });

      toast({
        title: t('payments.status.pending'),
        description: t('payments.teamPaymentInfo'),
      });

      if (payment.paymentUrl && onPaymentCreated) {
        onPaymentCreated(payment.paymentUrl);
      }

      onOpenChange(false);
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

  const amount = paymentSettings.depositAmount || paymentSettings.totalFee || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('payments.selectPaymentType')}</DialogTitle>
          <DialogDescription>{t('payments.selectPaymentTypeDescription')}</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <PaymentTypeSelector
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            amount={amount}
            currency={paymentSettings.depositCurrency || 'ARS'}
            allowTeamPayment={paymentSettings.allowTeamPayment}
            allowSplitPayment={paymentSettings.allowSplitPayment}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={creating}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleCreatePayment} disabled={creating}>
            {creating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('common.loading')}
              </>
            ) : (
              t('payments.payNow')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
