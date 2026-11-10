import { useNavigate } from 'react-router-dom'
import { TournamentForm } from '@/components/organizer/TournamentForm'
import { TournamentFormData } from '@/lib/validators'
import { tournamentsApi } from '@/services/api/tournaments'
import { useToast } from '@/hooks/useToast'
import { useTranslation } from 'react-i18next'

export function CreateTournamentPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { t } = useTranslation()

  const handleSubmit = async (data: TournamentFormData) => {
    try {
      const tournament = await tournamentsApi.create(data as any)
      toast({
        title: t('common.success'),
        description: t('organizer.toast.created'),
      })
      navigate(`/organizer/tournaments/${tournament.id}`)
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.response?.data?.message || t('organizer.toast.createFailed'),
        variant: 'destructive',
      })
      throw error
    }
  }

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('organizer.create.title')}</h1>
        <p className="text-muted-foreground">
          {t('organizer.create.subtitle')}
        </p>
      </div>
      <TournamentForm onSubmit={handleSubmit} />
    </div>
  )
}
