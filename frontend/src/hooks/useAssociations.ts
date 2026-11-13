import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { associationsApi } from '@/services/api/associations'
import { CreateMembershipRequest, UpdateCategoryRequest } from '@/types/association'
import { toast } from '@/hooks/useToast'

export function useAssociations() {
  return useQuery({
    queryKey: ['associations'],
    queryFn: () => associationsApi.list(),
  })
}

export function useAssociation(id: string) {
  return useQuery({
    queryKey: ['association', id],
    queryFn: () => associationsApi.getById(id),
    enabled: !!id,
  })
}

export function useAddMembership() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ associationId, data }: { associationId: string; data: CreateMembershipRequest }) =>
      associationsApi.addMembership(associationId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['associations'] })
      queryClient.invalidateQueries({ queryKey: ['association', variables.associationId] })
      toast({
        title: 'Membership requested',
        description: 'Your membership request has been submitted successfully.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to request membership.',
        variant: 'destructive',
      })
    },
  })
}

export function useRemoveMembership() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ associationId, userId }: { associationId: string; userId: string }) =>
      associationsApi.removeMembership(associationId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['associations'] })
      queryClient.invalidateQueries({ queryKey: ['association', variables.associationId] })
      toast({
        title: 'Membership removed',
        description: 'Your membership has been removed successfully.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove membership.',
        variant: 'destructive',
      })
    },
  })
}

export function useUpdateMemberCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ 
      associationId, 
      userId, 
      data 
    }: { 
      associationId: string
      userId: string
      data: UpdateCategoryRequest 
    }) => associationsApi.updateMemberCategory(associationId, userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['associations'] })
      queryClient.invalidateQueries({ queryKey: ['association', variables.associationId] })
      toast({
        title: 'Category updated',
        description: 'Your category has been updated successfully.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update category.',
        variant: 'destructive',
      })
    },
  })
}

export function useMemberCategory(associationId: string, userId: string) {
  return useQuery({
    queryKey: ['memberCategory', associationId, userId],
    queryFn: () => associationsApi.getMemberCategory(associationId, userId),
    enabled: !!associationId && !!userId,
  })
}
