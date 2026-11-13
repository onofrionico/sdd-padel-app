import { Link } from 'react-router-dom'
import { Association } from '@/types/association'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, Globe, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

interface AssociationCardProps {
  association: Association
  className?: string
  showMembershipStatus?: boolean
  isMember?: boolean
}

export function AssociationCard({ 
  association, 
  className,
  showMembershipStatus = false,
  isMember = false
}: AssociationCardProps) {
  const { t } = useTranslation()
  
  return (
    <Link to={`/associations/${association.id}`}>
      <Card className={cn('hover:shadow-lg transition-shadow cursor-pointer', className)}>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3 flex-1">
              {association.logoUrl ? (
                <img 
                  src={association.logoUrl} 
                  alt={`${association.name} logo`}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl line-clamp-1">{association.name}</CardTitle>
                {showMembershipStatus && (
                  <Badge 
                    variant={isMember ? "default" : "outline"}
                    className="mt-1"
                  >
                    {isMember ? t('association.card.member') : t('association.card.notMember')}
                  </Badge>
                )}
              </div>
            </div>
            {association.isActive ? (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                {t('association.card.active')}
              </Badge>
            ) : (
              <Badge variant="outline">{t('association.card.inactive')}</Badge>
            )}
          </div>
          {association.description && (
            <CardDescription className="line-clamp-2 mt-2">
              {association.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {association.website && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe className="h-4 w-4" />
              <span className="truncate">{association.website}</span>
            </div>
          )}

          {Object.keys(association.pointsByRound).length > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{t('association.card.pointsSystem')}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
