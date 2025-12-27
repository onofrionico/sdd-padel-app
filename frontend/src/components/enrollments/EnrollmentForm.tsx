import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { enrollmentSchema, EnrollmentFormData } from '@/lib/validators'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PartnerSelector } from './PartnerSelector'
import { Tournament } from '@/types/tournament'

interface EnrollmentFormProps {
  tournament: Tournament
  onSubmit: (data: EnrollmentFormData) => void
  isSubmitting?: boolean
  onCancel?: () => void
}

export function EnrollmentForm({
  tournament,
  onSubmit,
  isSubmitting = false,
  onCancel,
}: EnrollmentFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      tournamentId: tournament.id,
    },
  })

  const selectedPartnerId = watch('partnerId')
  const selectedCategory = watch('category')

  const handlePartnerSelect = (partnerId: number) => {
    setValue('partnerId', partnerId, { shouldValidate: true })
  }

  const handleCategoryChange = (value: string) => {
    setValue('category', parseInt(value), { shouldValidate: true })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <input type="hidden" {...register('tournamentId')} />

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={selectedCategory?.toString()} onValueChange={handleCategoryChange}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {tournament.categories.map((category) => (
              <SelectItem key={category} value={category.toString()}>
                {category}° Category
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-destructive">{errors.category.message}</p>
        )}
      </div>

      <PartnerSelector
        selectedPartnerId={selectedPartnerId}
        onSelectPartner={handlePartnerSelect}
      />
      {errors.partnerId && (
        <p className="text-sm text-destructive">{errors.partnerId.message}</p>
      )}

      <div className="flex gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting || !selectedPartnerId || !selectedCategory}
          className="flex-1"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Enrollment'}
        </Button>
      </div>
    </form>
  )
}
