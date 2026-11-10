import { useParams, Link } from 'react-router-dom'
import { useTournament } from '@/hooks/useTournaments'
import { TournamentDetails } from '@/components/tournaments/TournamentDetails'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { EnrollmentDialog } from '@/components/enrollments/EnrollmentDialog'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from 'react-i18next'

export function TournamentDetailsPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  
  const { data: tournament, isLoading, error } = useTournament(id || '')

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  if (error || !tournament) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <p className="text-destructive text-lg">{t('tournament.details.notFound')}</p>
          <Button asChild className="mt-4">
            <Link to="/tournaments">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('tournament.details.back')}
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/tournaments">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('tournament.details.back')}
        </Link>
      </Button>

      <TournamentDetails tournament={tournament} />

      {user && (
        <div className="mt-8 flex justify-center">
          <EnrollmentDialog
            tournament={tournament}
            disabled={
              tournament.status !== 'upcoming' && tournament.status !== 'registration_open'
            }
          />
        </div>
      )}

      {!user && (
        <div className="mt-8 rounded-lg border bg-muted/50 p-6 text-center">
          <p className="mb-4 text-muted-foreground">
            {t('tournament.details.loginRequired')}
          </p>
          <Button asChild>
            <Link to="/login">{t('tournament.details.loginToEnroll')}</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
