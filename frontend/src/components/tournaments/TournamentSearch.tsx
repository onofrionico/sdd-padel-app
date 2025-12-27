import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface TournamentSearchProps {
  value?: string
  onSearch: (search: string) => void
  placeholder?: string
}

export function TournamentSearch({
  value = '',
  onSearch,
  placeholder = 'Search tournaments...',
}: TournamentSearchProps) {
  const [searchValue, setSearchValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchValue)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchValue, onSearch])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="pl-10"
      />
    </div>
  )
}
