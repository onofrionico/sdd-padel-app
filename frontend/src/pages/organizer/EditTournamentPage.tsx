import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { TournamentForm } from '@/components/organizer/TournamentForm'
import { TournamentFormData } from '@/lib/validators'
import { tournamentsApi } from '@/services/api/tournaments'
import { useToast } from '@/hooks/useToast'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function EditTournamentPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const { data: tournament, isLoading, error } = useQuery({
    queryKey: ['tournament', id],
    queryFn: () => tournamentsApi.getById(id || ''),
    enabled: !!id,
  })

  const handleSubmit = async (data: TournamentFormData) => {
    try {
      await tournamentsApi.update(id || '', data as any)
      await queryClient.invalidateQueries({ queryKey: ['tournament', id] })
      await queryClient.invalidateQueries({ queryKey: ['tournaments'] })
      toast({
        title: t('common.success'),
        description: t('organizer.toast.updated'),
      })
      navigate(`/organizer/tournaments/${id}`)
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.response?.data?.message || t('organizer.toast.updateFailed'),
        variant: 'destructive',
      })
      throw error
    }
  }

  if (isLoading) {
    return (
      <div className="container py-8 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !tournament) {
    return (
      <div className="container py-8 max-w-4xl">
        <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-4 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <span>{t('organizer.loadTournamentFailed')}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('organizer.edit.title')}</h1>
        <p className="text-muted-foreground">
          {t('organizer.edit.subtitle')}
        </p>
      </div>
      <TournamentForm tournament={tournament} onSubmit={handleSubmit} />
    </div>
  )
}
