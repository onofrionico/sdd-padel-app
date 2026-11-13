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
    onSuccess: async (data) => {
      console.log('Upload successful, response:', data)
      await queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] })
      
      try {
        console.log('Fetching updated profile...')
        const updatedUser = await authApi.getProfile()
        console.log('Updated user:', updatedUser)
        updateUser(updatedUser)

        toast({
          title: 'Success',
          description: 'Profile picture updated successfully',
        })
      } catch (error) {
        console.error('Error fetching updated profile:', error)
        throw error
      }
    },
    onError: (error: Error) => {
      console.error('Upload error:', error)
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
