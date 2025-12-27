import { Card } from '@/components/ui/card'
import { EnrollmentStatusBadge } from './EnrollmentStatusBadge'
import { EnrollmentWithDetails } from '@/types/enrollment'
import { Calendar, MapPin, Users } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface EnrollmentCardProps {
  enrollment: EnrollmentWithDetails
}

export function EnrollmentCard({ enrollment }: EnrollmentCardProps) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <div className="p-4 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">
              {enrollment.tournament.name}
            </h3>
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(enrollment.tournament.startDate)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span>{enrollment.tournament.location}</span>
              </div>
            </div>
          </div>
          <EnrollmentStatusBadge status={enrollment.status} />
        </div>

        <div className="space-y-2 border-t pt-4">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Team:</span>
            <span className="text-muted-foreground">
              {enrollment.player1.fullName} & {enrollment.player2.fullName}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Category:</span>
            <span className="text-muted-foreground">{enrollment.category}° Category</span>
          </div>
        </div>

        {enrollment.status === 'pending' && (
          <div className="mt-4 rounded-md bg-yellow-50 p-3 text-sm text-yellow-800">
            Your enrollment is pending approval from the tournament organizer.
          </div>
        )}

        {enrollment.status === 'approved' && (
          <div className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-800">
            Your enrollment has been approved! Good luck in the tournament.
          </div>
        )}

        {enrollment.status === 'rejected' && (
          <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-800">
            Your enrollment was not approved. Please contact the organizer for more information.
          </div>
        )}
      </div>
    </Card>
  )
}
