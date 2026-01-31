import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { PaymentType } from '../../types/payment.types';
import { Users, User, Info } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface PaymentTypeSelectorProps {
  selectedType: PaymentType;
  onTypeChange: (type: PaymentType) => void;
  amount: number;
  currency: string;
  allowTeamPayment?: boolean;
  allowSplitPayment?: boolean;
}

export const PaymentTypeSelector: React.FC<PaymentTypeSelectorProps> = ({
  selectedType,
  onTypeChange,
  amount,
  currency,
  allowTeamPayment = true,
  allowSplitPayment = true,
}) => {
  const { t } = useTranslation();

  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency,
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('payments.selectPaymentType')}</CardTitle>
        <CardDescription>{t('payments.selectPaymentTypeDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedType}
          onValueChange={(value: string) => onTypeChange(value as PaymentType)}
          className="space-y-4"
        >
          {/* Team Payment */}
          {allowTeamPayment && (
            <div className="flex items-start space-x-3 space-y-0">
              <RadioGroupItem value="full_team" id="full_team" />
              <Label
                htmlFor="full_team"
                className="flex-1 cursor-pointer font-normal space-y-2"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="font-semibold">{t('payments.type.fullTeam')}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('payments.type.fullTeamDescription')}
                </p>
                <div className="text-lg font-bold text-primary">
                  {formatAmount(amount)}
                </div>
              </Label>
            </div>
          )}

          {/* Split Payment */}
          {allowSplitPayment && (
            <div className="flex items-start space-x-3 space-y-0">
              <RadioGroupItem value="split" id="split" />
              <Label htmlFor="split" className="flex-1 cursor-pointer font-normal space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  <span className="font-semibold">{t('payments.type.split')}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('payments.type.splitDescription')}
                </p>
                <div className="text-lg font-bold text-primary">
                  {formatAmount(amount / 2)} {t('payments.perPlayer')}
                </div>
              </Label>
            </div>
          )}
        </RadioGroup>

        {/* Info Alert */}
        <Alert className="mt-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            {selectedType === 'full_team'
              ? t('payments.teamPaymentInfo')
              : t('payments.splitPaymentInfo')}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
