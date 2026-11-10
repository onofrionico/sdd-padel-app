import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Search, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usersApi } from '@/services/api/users'
import { useTranslation } from 'react-i18next'

interface Partner {
  id: string
  fullName: string
  email: string
}

interface PartnerSelectorProps {
  selectedPartnerId?: string
  onSelectPartner: (partnerId: string) => void
  className?: string
}

export function PartnerSelector({
  selectedPartnerId,
  onSelectPartner,
  className,
}: PartnerSelectorProps) {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Partner[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const results = await usersApi.searchUsers(searchQuery)
      setSearchResults(results)
    } catch (error) {
      console.error('Failed to search partners:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-2">
        <Label htmlFor="partner-search">{t('enrollment.partner.label')}</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="partner-search"
              type="text"
              placeholder={t('enrollment.partner.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-9"
            />
          </div>
          <Button
            type="button"
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
          >
            {isSearching ? t('enrollment.partner.searching') : t('enrollment.partner.search')}
          </Button>
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className="space-y-2">
          <Label>{t('enrollment.partner.results')}</Label>
          <div className="max-h-60 space-y-2 overflow-y-auto">
            {searchResults.map((partner) => (
              <Card
                key={partner.id}
                className={cn(
                  'cursor-pointer p-3 transition-colors hover:bg-accent',
                  selectedPartnerId === partner.id && 'border-primary bg-accent'
                )}
                onClick={() => onSelectPartner(partner.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{partner.fullName}</p>
                    <p className="text-sm text-muted-foreground">{partner.email}</p>
                  </div>
                  {selectedPartnerId === partner.id && (
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {searchQuery && searchResults.length === 0 && !isSearching && (
        <p className="text-center text-sm text-muted-foreground">
          {t('enrollment.partner.noResults')}
        </p>
      )}
    </div>
  )
}
