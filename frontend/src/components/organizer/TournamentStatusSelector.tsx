import { Tournament } from '@/types/tournament'
import { Label } from '@/components/ui/label'

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
  const statuses: Array<{ value: Tournament['status']; label: string; description: string }> = [
    {
      value: 'upcoming',
      label: 'Upcoming',
      description: 'Tournament is scheduled but not started',
    },
    {
      value: 'in_progress',
      label: 'In Progress',
      description: 'Tournament is currently active',
    },
    {
      value: 'completed',
      label: 'Completed',
      description: 'Tournament has finished',
    },
    {
      value: 'cancelled',
      label: 'Cancelled',
      description: 'Tournament was cancelled',
    },
  ]

  return (
    <div className="space-y-2">
      <Label htmlFor="status">Tournament Status</Label>
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
