import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAddMembership, useRemoveMembership } from '@/hooks/useAssociations'
import { useAuth } from '@/contexts/AuthContext'
import { UserPlus, UserMinus, Loader2 } from 'lucide-react'

interface MembershipRequestButtonProps {
  associationId: string
  isMember: boolean
  onSuccess?: () => void
}

export function MembershipRequestButton({ 
  associationId, 
  isMember,
  onSuccess 
}: MembershipRequestButtonProps) {
  const { user } = useAuth()
  const addMembership = useAddMembership()
  const removeMembership = useRemoveMembership()
  const [isLoading, setIsLoading] = useState(false)

  const handleRequestMembership = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      await addMembership.mutateAsync({
        associationId,
        data: {
          userId: user.id.toString(),
          role: 'member',
        },
      })
      onSuccess?.()
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveMembership = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      await removeMembership.mutateAsync({
        associationId,
        userId: user.id.toString(),
      })
      onSuccess?.()
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  if (isMember) {
    return (
      <Button
        variant="outline"
        onClick={handleRemoveMembership}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Removing...
          </>
        ) : (
          <>
            <UserMinus className="mr-2 h-4 w-4" />
            Leave Association
          </>
        )}
      </Button>
    )
  }

  return (
    <Button
      onClick={handleRequestMembership}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Requesting...
        </>
      ) : (
        <>
          <UserPlus className="mr-2 h-4 w-4" />
          Request Membership
        </>
      )}
    </Button>
  )
}
