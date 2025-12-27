import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tournamentsApi } from '@/services/api/tournaments'
import { TournamentFilters, Tournament } from '@/types/tournament'
import { toast } from '@/hooks/useToast'

export function useTournaments(filters?: TournamentFilters) {
  return useQuery({
    queryKey: ['tournaments', filters],
    queryFn: () => tournamentsApi.list(filters),
  })
}

export function useTournament(id: number) {
  return useQuery({
    queryKey: ['tournament', id],
    queryFn: () => tournamentsApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateTournament() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: tournamentsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] })
      toast({
        title: 'Tournament created',
        description: 'The tournament has been created successfully.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create tournament.',
        variant: 'destructive',
      })
    },
  })
}

export function useUpdateTournament() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Tournament> }) =>
      tournamentsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] })
      queryClient.invalidateQueries({ queryKey: ['tournament', variables.id] })
      toast({
        title: 'Tournament updated',
        description: 'The tournament has been updated successfully.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update tournament.',
        variant: 'destructive',
      })
    },
  })
}

export function useDeleteTournament() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: tournamentsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] })
      toast({
        title: 'Tournament deleted',
        description: 'The tournament has been deleted successfully.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete tournament.',
        variant: 'destructive',
      })
    },
  })
}

export function useUpdateTournamentStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: Tournament['status'] }) =>
      tournamentsApi.updateStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] })
      queryClient.invalidateQueries({ queryKey: ['tournament', variables.id] })
      toast({
        title: 'Status updated',
        description: 'The tournament status has been updated successfully.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update tournament status.',
        variant: 'destructive',
      })
    },
  })
}
