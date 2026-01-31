import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { PaymentSettings } from '../../types/payment.types';
import { DollarSign, Settings, Info } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface PaymentSettingsFormProps {
  initialSettings?: PaymentSettings;
  onSave: (settings: PaymentSettings) => Promise<void>;
  disabled?: boolean;
}

export const PaymentSettingsForm: React.FC<PaymentSettingsFormProps> = ({
  initialSettings,
  onSave,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PaymentSettings>({
    defaultValues: initialSettings || {
      requiresDeposit: false,
      depositAmount: 0,
      depositCurrency: 'ARS',
      totalFee: 0,
      paymentDeadlineHours: 48,
      allowTeamPayment: true,
      allowSplitPayment: true,
      platformFeePercentage: 5,
      refundPolicy: {
        fullRefundDeadlineHours: 48,
        partialRefundPercentage: 50,
        noRefundDeadlineHours: 24,
        refundPlatformFee: false,
      },
    },
  });

  const requiresDeposit = watch('requiresDeposit');
  const allowTeamPayment = watch('allowTeamPayment');
  const allowSplitPayment = watch('allowSplitPayment');

  const onSubmit = async (data: PaymentSettings) => {
    try {
      setLoading(true);
      await onSave(data);
    } catch (error) {
      console.error('Error saving payment settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            {t('payments.settings.basicSettings')}
          </CardTitle>
          <CardDescription>{t('payments.settings.basicSettingsDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Require Deposit */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="requiresDeposit">{t('payments.settings.requireDeposit')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('payments.settings.requireDepositDescription')}
              </p>
            </div>
            <Switch
              id="requiresDeposit"
              checked={requiresDeposit}
              onCheckedChange={(checked: boolean) => setValue('requiresDeposit', checked)}
              disabled={disabled}
            />
          </div>

          {requiresDeposit && (
            <>
              <Separator />

              {/* Deposit Amount */}
              <div className="space-y-2">
                <Label htmlFor="depositAmount">{t('payments.settings.depositAmount')}</Label>
                <Input
                  id="depositAmount"
                  type="number"
                  step="0.01"
                  {...register('depositAmount', {
                    required: requiresDeposit,
                    min: 0,
                  })}
                  disabled={disabled}
                />
                {errors.depositAmount && (
                  <p className="text-sm text-destructive">{t('common.required')}</p>
                )}
              </div>

              {/* Total Fee */}
              <div className="space-y-2">
                <Label htmlFor="totalFee">{t('payments.settings.totalFee')}</Label>
                <Input
                  id="totalFee"
                  type="number"
                  step="0.01"
                  {...register('totalFee', { min: 0 })}
                  disabled={disabled}
                />
                <p className="text-sm text-muted-foreground">
                  {t('payments.settings.totalFeeDescription')}
                </p>
              </div>

              {/* Payment Deadline */}
              <div className="space-y-2">
                <Label htmlFor="paymentDeadlineHours">
                  {t('payments.settings.paymentDeadline')}
                </Label>
                <Input
                  id="paymentDeadlineHours"
                  type="number"
                  {...register('paymentDeadlineHours', {
                    required: requiresDeposit,
                    min: 1,
                  })}
                  disabled={disabled}
                />
                <p className="text-sm text-muted-foreground">
                  {t('payments.settings.paymentDeadlineDescription')}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Payment Options */}
      {requiresDeposit && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              {t('payments.settings.paymentOptions')}
            </CardTitle>
            <CardDescription>{t('payments.settings.paymentOptionsDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Allow Team Payment */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="allowTeamPayment">{t('payments.settings.allowTeamPayment')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('payments.settings.allowTeamPaymentDescription')}
                </p>
              </div>
              <Switch
                id="allowTeamPayment"
                checked={allowTeamPayment}
                onCheckedChange={(checked: boolean) => setValue('allowTeamPayment', checked)}
                disabled={disabled}
              />
            </div>

            <Separator />

            {/* Allow Split Payment */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="allowSplitPayment">
                  {t('payments.settings.allowSplitPayment')}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t('payments.settings.allowSplitPaymentDescription')}
                </p>
              </div>
              <Switch
                id="allowSplitPayment"
                checked={allowSplitPayment}
                onCheckedChange={(checked: boolean) => setValue('allowSplitPayment', checked)}
                disabled={disabled}
              />
            </div>

            {!allowTeamPayment && !allowSplitPayment && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  {t('payments.settings.atLeastOnePaymentOption')}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Refund Policy */}
      {requiresDeposit && (
        <Card>
          <CardHeader>
            <CardTitle>{t('payments.settings.refundPolicy')}</CardTitle>
            <CardDescription>{t('payments.settings.refundPolicyDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Full Refund Deadline */}
            <div className="space-y-2">
              <Label htmlFor="fullRefundDeadlineHours">
                {t('payments.settings.fullRefundDeadline')}
              </Label>
              <Input
                id="fullRefundDeadlineHours"
                type="number"
                {...register('refundPolicy.fullRefundDeadlineHours', { min: 0 })}
                disabled={disabled}
              />
              <p className="text-sm text-muted-foreground">
                {t('payments.settings.fullRefundDeadlineDescription')}
              </p>
            </div>

            {/* Partial Refund Percentage */}
            <div className="space-y-2">
              <Label htmlFor="partialRefundPercentage">
                {t('payments.settings.partialRefundPercentage')}
              </Label>
              <Input
                id="partialRefundPercentage"
                type="number"
                min="0"
                max="100"
                {...register('refundPolicy.partialRefundPercentage', { min: 0, max: 100 })}
                disabled={disabled}
              />
              <p className="text-sm text-muted-foreground">
                {t('payments.settings.partialRefundPercentageDescription')}
              </p>
            </div>

            {/* No Refund Deadline */}
            <div className="space-y-2">
              <Label htmlFor="noRefundDeadlineHours">
                {t('payments.settings.noRefundDeadline')}
              </Label>
              <Input
                id="noRefundDeadlineHours"
                type="number"
                {...register('refundPolicy.noRefundDeadlineHours', { min: 0 })}
                disabled={disabled}
              />
              <p className="text-sm text-muted-foreground">
                {t('payments.settings.noRefundDeadlineDescription')}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={disabled || loading}>
          {loading ? t('common.saving') : t('common.save')}
        </Button>
      </div>
    </form>
  );
};
