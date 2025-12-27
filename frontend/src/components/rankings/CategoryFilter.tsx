import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface CategoryFilterProps {
  value?: number
  onChange: (value: number | undefined) => void
}

const categories = [
  { id: 1, name: '1ra Categoría' },
  { id: 2, name: '2da Categoría' },
  { id: 3, name: '3ra Categoría' },
  { id: 4, name: '4ta Categoría' },
  { id: 5, name: '5ta Categoría' },
  { id: 6, name: '6ta Categoría' },
  { id: 7, name: '7ma Categoría' },
  { id: 8, name: '8va Categoría' },
]

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <Select
      value={value?.toString() || 'all'}
      onValueChange={(val) => onChange(val === 'all' ? undefined : parseInt(val))}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="All Categories" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Categories</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.id.toString()}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
