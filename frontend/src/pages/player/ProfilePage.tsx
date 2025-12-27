import { useAuth } from '@/contexts/AuthContext'
import { useMyStatistics } from '@/hooks/useRankings'
import { PlayerStatistics } from '@/components/rankings/PlayerStatistics'
import { TournamentStatistics } from '@/components/rankings/TournamentStatistics'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Mail, Phone, MapPin } from 'lucide-react'

export function ProfilePage() {
  const { user } = useAuth()
  const { data: statistics, isLoading, error } = useMyStatistics()

  if (!user) {
    return (
      <div className="container py-8">
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-center">
          <p className="text-destructive">Please log in to view your profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Name</div>
                <div className="font-medium">{user.firstName} {user.lastName}</div>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>

              {user.phoneNumber && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{user.phoneNumber}</span>
                </div>
              )}

              {user.gender && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="capitalize">{user.gender}</span>
                </div>
              )}

              <div className="pt-4 border-t">
                <div className="text-sm text-muted-foreground mb-1">Role</div>
                <div className="font-medium capitalize">{user.role}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="lg:col-span-2 space-y-6">
          {isLoading ? (
            <LoadingSpinner size="lg" />
          ) : error ? (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-center">
              <p className="text-destructive">Failed to load statistics.</p>
            </div>
          ) : statistics ? (
            <>
              <div>
                <h2 className="text-xl font-semibold mb-4">Performance Statistics</h2>
                <PlayerStatistics statistics={statistics} />
              </div>

              {statistics.recentTournaments.length > 0 && (
                <div>
                  <TournamentStatistics tournaments={statistics.recentTournaments} />
                </div>
              )}
            </>
          ) : (
            <div className="rounded-lg border bg-muted/50 p-8 text-center">
              <p className="text-muted-foreground">
                No statistics available yet. Participate in tournaments to see your stats!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
