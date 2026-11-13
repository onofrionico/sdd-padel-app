import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function TournamentSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="space-y-2">
          <div className="h-6 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-4 bg-muted rounded animate-pulse" />
        <div className="flex gap-2">
          <div className="h-6 bg-muted rounded w-20 animate-pulse" />
          <div className="h-6 bg-muted rounded w-20 animate-pulse" />
        </div>
        <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
      </CardContent>
    </Card>
  )
}
