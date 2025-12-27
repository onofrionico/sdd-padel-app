import { useNavigate } from 'react-router-dom'
import { TournamentForm } from '@/components/organizer/TournamentForm'
import { TournamentFormData } from '@/lib/validators'
import { tournamentsApi } from '@/services/api/tournaments'
import { useToast } from '@/hooks/useToast'

export function CreateTournamentPage() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (data: TournamentFormData) => {
    try {
      const tournament = await tournamentsApi.create(data as any)
      toast({
        title: 'Success',
        description: 'Tournament created successfully',
      })
      navigate(`/organizer/tournaments/${tournament.id}`)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create tournament',
        variant: 'destructive',
      })
      throw error
    }
  }

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Tournament</h1>
        <p className="text-muted-foreground">
          Set up a new tournament for your association
        </p>
      </div>
      <TournamentForm onSubmit={handleSubmit} />
    </div>
  )
}
