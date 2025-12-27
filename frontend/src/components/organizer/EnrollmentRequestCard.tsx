import { EnrollmentWithDetails } from '@/types/enrollment'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EnrollmentStatusBadge } from '@/components/enrollments/EnrollmentStatusBadge'
import { Check, X, Users } from 'lucide-react'

interface EnrollmentRequestCardProps {
  enrollment: EnrollmentWithDetails
  onApprove: (enrollmentId: number) => void
  onReject: (enrollmentId: number) => void
  isLoading?: boolean
}

export function EnrollmentRequestCard({
  enrollment,
  onApprove,
  onReject,
  isLoading = false,
}: EnrollmentRequestCardProps) {
  const isPending = enrollment.status === 'pending'

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-semibold">
                {enrollment.player1.firstName} {enrollment.player1.lastName}
              </p>
              <p className="text-sm text-muted-foreground">
                {enrollment.player1.email}
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
            {enrollment.player2.firstName} {enrollment.player2.lastName} ({enrollment.player2.email})
          </p>
        </div>
        <div>
          <p className="text-sm font-medium">Category:</p>
          <p className="text-sm text-muted-foreground">Category {enrollment.category}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Enrolled:</p>
          <p className="text-sm text-muted-foreground">
            {new Date(enrollment.createdAt).toLocaleDateString()}
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
