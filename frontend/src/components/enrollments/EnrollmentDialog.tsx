import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { EnrollmentForm } from './EnrollmentForm'
import { useEnrollments } from '@/hooks/useEnrollments'
import { Tournament } from '@/types/tournament'
import { EnrollmentFormData } from '@/lib/validators'
import { UserPlus } from 'lucide-react'

interface EnrollmentDialogProps {
  tournament: Tournament
  disabled?: boolean
  children?: React.ReactNode
}

export function EnrollmentDialog({ tournament, disabled, children }: EnrollmentDialogProps) {
  const [open, setOpen] = useState(false)
  const { createEnrollment, isCreatingEnrollment } = useEnrollments()

  const handleSubmit = (data: EnrollmentFormData) => {
    createEnrollment(data)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button disabled={disabled} size="lg" className="w-full sm:w-auto">
            <UserPlus className="mr-2 h-5 w-5" />
            Enroll in Tournament
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Enroll in {tournament.name}</DialogTitle>
          <DialogDescription>
            Select your partner and category to enroll in this tournament. Your enrollment will
            be reviewed by the organizer.
          </DialogDescription>
        </DialogHeader>
        <EnrollmentForm
          tournament={tournament}
          onSubmit={handleSubmit}
          isSubmitting={isCreatingEnrollment}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
