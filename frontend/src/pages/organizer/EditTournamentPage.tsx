import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { TournamentForm } from '@/components/organizer/TournamentForm'
import { TournamentFormData } from '@/lib/validators'
import { tournamentsApi } from '@/services/api/tournaments'
import { useToast } from '@/hooks/useToast'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { AlertCircle } from 'lucide-react'

export function EditTournamentPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()

  const { data: tournament, isLoading, error } = useQuery({
    queryKey: ['tournament', id],
    queryFn: () => tournamentsApi.getById(Number(id)),
    enabled: !!id,
  })

  const handleSubmit = async (data: TournamentFormData) => {
    try {
      await tournamentsApi.update(Number(id), data as any)
      toast({
        title: 'Success',
        description: 'Tournament updated successfully',
      })
      navigate(`/organizer/tournaments/${id}`)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update tournament',
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
          <span>Failed to load tournament. Please try again.</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Edit Tournament</h1>
        <p className="text-muted-foreground">
          Update tournament details and settings
        </p>
      </div>
      <TournamentForm tournament={tournament} onSubmit={handleSubmit} />
    </div>
  )
}
