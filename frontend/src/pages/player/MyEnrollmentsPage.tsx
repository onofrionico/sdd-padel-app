import { useEnrollments } from '@/hooks/useEnrollments'
import { EnrollmentCard } from '@/components/enrollments/EnrollmentCard'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { UserPlus, AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function MyEnrollmentsPage() {
  const { t } = useTranslation()
  const { myEnrollments, isLoadingEnrollments, enrollmentsError } = useEnrollments()

  if (isLoadingEnrollments) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (enrollmentsError) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div className="text-center">
          <h2 className="text-xl font-semibold">{t('enrollment.my.loadFailedTitle')}</h2>
          <p className="text-muted-foreground">
            {t('enrollment.my.loadFailed')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.quickActions.myEnrollments.title')}</h1>
        <p className="mt-2 text-muted-foreground">
          {t('enrollment.my.subtitle')}
        </p>
      </div>

      {!myEnrollments || myEnrollments.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-6 rounded-lg border-2 border-dashed p-8 text-center">
          <UserPlus className="h-16 w-16 text-muted-foreground" />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">{t('enrollment.my.emptyTitle')}</h2>
            <p className="text-muted-foreground">
              {t('enrollment.my.emptyDescription')}
            </p>
          </div>
          <Button asChild size="lg">
            <Link to="/tournaments">{t('dashboard.quickActions.browseTournaments.title')}</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {myEnrollments.length} enrollment{myEnrollments.length !== 1 ? 's' : ''}
            </p>
            <Button asChild variant="outline">
              <Link to="/tournaments">{t('enrollment.my.findMore')}</Link>
            </Button>
          </div>

          <div className="grid gap-4">
            {myEnrollments.map((enrollment) => (
              <EnrollmentCard key={enrollment.id} enrollment={enrollment} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
