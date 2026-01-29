import { EnrollmentWithDetails } from '@/types/enrollment'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EnrollmentStatusBadge } from '@/components/enrollments/EnrollmentStatusBadge'
import { Check, X, Users } from 'lucide-react'

interface EnrollmentRequestCardProps {
  enrollment: EnrollmentWithDetails
  onApprove: (enrollmentId: string) => void
  onReject: (enrollmentId: string) => void
  isLoading?: boolean
}

export function EnrollmentRequestCard({
  enrollment,
  onApprove,
  onReject,
  isLoading = false,
}: EnrollmentRequestCardProps) {
  const isPending = enrollment.status === 'pending'
  const players = enrollment.team?.players || []
  const player1 = players[0]?.user
  const player2 = players[1]?.user
  const category = players[0]?.category

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-semibold">
                {player1 ? `${player1.firstName} ${player1.lastName}` : 'Unknown Player'}
              </p>
              <p className="text-sm text-muted-foreground">
                {player1?.email || 'N/A'}
              </p>
            </div>
          </div>
          <EnrollmentStatusBadge status={enrollment.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <p className="text-sm font-medium">Partner:</p>
          <p className="text-sm text-muted-foreground">
            {player2 ? `${player2.firstName} ${player2.lastName} (${player2.email})` : 'N/A'}
          </p>
        </div>
        {category && (
          <div>
            <p className="text-sm font-medium">Category:</p>
            <p className="text-sm text-muted-foreground">Category {category}</p>
          </div>
        )}
        <div>
          <p className="text-sm font-medium">Enrolled:</p>
          <p className="text-sm text-muted-foreground">
            {new Date(enrollment.registeredAt).toLocaleDateString()}
          </p>
        </div>
      </CardContent>
      {isPending && (
        <CardFooter className="flex gap-2">
          <Button
            size="sm"
            variant="default"
            onClick={() => onApprove(enrollment.id)}
            disabled={isLoading}
            className="flex-1"
          >
            <Check className="h-4 w-4 mr-2" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onReject(enrollment.id)}
            disabled={isLoading}
            className="flex-1"
          >
            <X className="h-4 w-4 mr-2" />
            Reject
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
