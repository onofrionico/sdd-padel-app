import { useAssociations } from '@/hooks/useAssociations'
import { AssociationCard } from './AssociationCard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Building2 } from 'lucide-react'

export function MyAssociations() {
  const { data: associations, isLoading, error } = useAssociations()

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <p>Failed to load associations</p>
            <p className="text-sm mt-2">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!associations || associations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Associations</CardTitle>
          <CardDescription>You are not a member of any associations yet</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            Browse available associations and request membership to get started
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">My Associations</h2>
        <p className="text-muted-foreground">
          Associations you are a member of
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {associations.map((association) => (
          <AssociationCard
            key={association.id}
            association={association}
            showMembershipStatus={true}
            isMember={true}
          />
        ))}
      </div>
    </div>
  )
}
