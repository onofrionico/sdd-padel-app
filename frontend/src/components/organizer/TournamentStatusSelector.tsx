import { Tournament } from '@/types/tournament'
import { Label } from '@/components/ui/label'
import { useTranslation } from 'react-i18next'

interface TournamentStatusSelectorProps {
  currentStatus: Tournament['status']
  onChange: (status: Tournament['status']) => void
  disabled?: boolean
}

export function TournamentStatusSelector({
  currentStatus,
  onChange,
  disabled = false,
}: TournamentStatusSelectorProps) {
  const { t } = useTranslation()
  const statuses: Array<{ value: Tournament['status']; label: string; description: string }> = [
    {
      value: 'upcoming',
      label: t('tournament.status.upcoming'),
      description: t('organizer.statusSelector.upcoming'),
    },
    {
      value: 'registration_open',
      label: t('tournament.status.registrationOpen'),
      description: t('organizer.statusSelector.registrationOpen'),
    },
    {
      value: 'in_progress',
      label: t('tournament.status.inProgress'),
      description: t('organizer.statusSelector.inProgress'),
    },
    {
      value: 'completed',
      label: t('tournament.status.completed'),
      description: t('organizer.statusSelector.completed'),
    },
    {
      value: 'cancelled',
      label: t('tournament.status.cancelled'),
      description: t('organizer.statusSelector.cancelled'),
    },
  ]

  return (
    <div className="space-y-2">
      <Label htmlFor="status">{t('organizer.overview.statusTitle')}</Label>
      <select
        id="status"
        value={currentStatus}
        onChange={(e) => onChange(e.target.value as Tournament['status'])}
        disabled={disabled}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {statuses.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>
      <p className="text-sm text-muted-foreground">
        {statuses.find((s) => s.value === currentStatus)?.description}
      </p>
    </div>
  )
}
