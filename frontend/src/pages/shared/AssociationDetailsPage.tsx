import { useParams, Link } from 'react-router-dom'
import { useAssociation, useMemberCategory } from '@/hooks/useAssociations'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MembershipRequestButton } from '@/components/associations/MembershipRequestButton'
import { CategoryUpdateDialog } from '@/components/associations/CategoryUpdateDialog'
import { ArrowLeft, Building2, Globe, Trophy } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { formatDate } from '@/lib/utils'

export function AssociationDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  
  const { data: association, isLoading, error, refetch } = useAssociation(id || '')
  const { data: memberCategory } = useMemberCategory(
    id || '', 
    user?.id.toString() || ''
  )

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  if (error || !association) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <p className="text-destructive text-lg">Association not found.</p>
          <Button asChild className="mt-4">
            <Link to="/associations">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Associations
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const isMember = memberCategory !== undefined && memberCategory.category !== null

  return (
    <div className="container py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/associations">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Associations
        </Link>
      </Button>

      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {association.logoUrl ? (
              <img 
                src={association.logoUrl} 
                alt={`${association.name} logo`}
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="h-10 w-10 text-primary" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{association.name}</h1>
              {association.isActive ? (
                <Badge className="mt-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  Active
                </Badge>
              ) : (
                <Badge variant="outline" className="mt-2">Inactive</Badge>
              )}
            </div>
          </div>
        </div>

        {association.description && (
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{association.description}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {association.website && (
                <div>
                  <p className="text-sm text-muted-foreground">Website</p>
                  <a 
                    href={association.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline"
                  >
                    {association.website}
                  </a>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">{formatDate(association.createdAt)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Points System
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(association.pointsByRound).length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(association.pointsByRound).map(([round, points]) => (
                    <div key={round} className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Round {round}</span>
                      <Badge variant="outline">{points} points</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No points system configured</p>
              )}
            </CardContent>
          </Card>
        </div>

        {user && (
          <Card>
            <CardHeader>
              <CardTitle>Membership</CardTitle>
              <CardDescription>
                {isMember 
                  ? 'You are a member of this association' 
                  : 'Join this association to participate in tournaments'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isMember && memberCategory?.category && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Your Category</p>
                  <Badge className="text-base px-4 py-2">
                    Category {memberCategory.category}
                  </Badge>
                </div>
              )}
              <div className="flex gap-3">
                <MembershipRequestButton
                  associationId={association.id}
                  isMember={isMember}
                  onSuccess={() => refetch()}
                />
                {isMember && (
                  <CategoryUpdateDialog
                    associationId={association.id}
                    currentCategory={memberCategory?.category ?? undefined}
                    onSuccess={() => refetch()}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {!user && (
          <div className="rounded-lg border bg-muted/50 p-6 text-center">
            <p className="mb-4 text-muted-foreground">
              You need to be logged in to join this association.
            </p>
            <Button asChild>
              <Link to="/login">Log In to Join</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
