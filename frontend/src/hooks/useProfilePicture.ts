import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/services/api/auth'
import { useToast } from '@/hooks/useToast'
import { useAuth } from '@/contexts/AuthContext'

export function useProfilePicture() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { updateUser } = useAuth()

  const uploadMutation = useMutation({
    mutationFn: (file: File) => authApi.uploadProfilePicture(file),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] })
      
      const updatedUser = await authApi.getProfile()
      updateUser(updatedUser)

      toast({
        title: 'Success',
        description: 'Profile picture updated successfully',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload profile picture',
        variant: 'destructive',
      })
    },
  })

  return {
    uploadProfilePicture: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    error: uploadMutation.error,
  }
}
