import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { enrollmentSchema, EnrollmentFormData } from '@/lib/validators'
import { Button } from '@/components/ui/button'
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

  const handlePartnerSelect = (partnerId: string) => {
    setValue('partnerId', partnerId, { shouldValidate: true })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <input type="hidden" {...register('tournamentId')} />

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
          disabled={isSubmitting || !selectedPartnerId}
          className="flex-1"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Enrollment'}
        </Button>
      </div>
    </form>
  )
}
