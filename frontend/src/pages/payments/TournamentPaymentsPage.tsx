import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/button';
import { PaymentDashboard } from '../../components/payments';
import { ArrowLeft } from 'lucide-react';

export const TournamentPaymentsPage: React.FC = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!tournamentId) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-center text-muted-foreground">{t('error.boundary.title')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('notFound.button.back')}
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('payments.dashboard.paymentsList')}</h1>
        <p className="text-muted-foreground mt-2">
          {t('payments.dashboard.paymentsListDescription')}
        </p>
      </div>

      <PaymentDashboard tournamentId={tournamentId} />
    </div>
  );
};
