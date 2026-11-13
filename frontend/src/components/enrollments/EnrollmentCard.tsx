import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EnrollmentStatusBadge } from './EnrollmentStatusBadge'
import { EnrollmentWithDetails } from '@/types/enrollment'
import { Calendar, Users, DollarSign } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

interface EnrollmentCardProps {
  enrollment: EnrollmentWithDetails
}

export function EnrollmentCard({ enrollment }: EnrollmentCardProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const players = enrollment.team?.players || []
  const player1 = players[0]?.user
  const player2 = players[1]?.user
  const teamName = enrollment.team?.name || t('enrollment.card.team')
  const category = players[0]?.category

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <div className="p-4 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">
              {enrollment.tournament?.name || t('enrollment.card.tournament')}
            </h3>
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{enrollment.tournament?.startDate ? formatDate(enrollment.tournament.startDate) : t('enrollment.card.tbd')}</span>
              </div>
            </div>
          </div>
          <EnrollmentStatusBadge status={enrollment.status} />
        </div>

        <div className="space-y-2 border-t pt-4">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{t('enrollment.card.team')}</span>
            <span className="text-muted-foreground">
              {player1 && player2 
                ? `${player1.firstName} ${player1.lastName} & ${player2.firstName} ${player2.lastName}`
                : teamName
              }
            </span>
          </div>
          {category && (
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{t('enrollment.card.category')}</span>
              <span className="text-muted-foreground">{t('enrollment.card.categoryNumber', { number: category })}</span>
            </div>
          )}
        </div>

        {enrollment.status === 'pending' && (
          <div className="mt-4 rounded-md bg-yellow-50 p-3 text-sm text-yellow-800">
            {t('enrollment.card.status.pending.message')}
          </div>
        )}

        {enrollment.status === 'approved' && (
          <div className="mt-4 space-y-2">
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
              {t('enrollment.card.status.approved.message')}
            </div>
            <Button
              onClick={() => navigate(`/payments/enrollments/${enrollment.id}`)}
              className="w-full"
              variant="default"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              {t('payments.payNow')}
            </Button>
          </div>
        )}

        {enrollment.status === 'rejected' && (
          <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-800">
            {t('enrollment.card.status.rejected.message')}
          </div>
        )}
      </div>
    </Card>
  )
}
