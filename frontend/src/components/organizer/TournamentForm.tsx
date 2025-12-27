import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { tournamentSchema, TournamentFormData } from '@/lib/validators'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Tournament } from '@/types/tournament'

interface TournamentFormProps {
  tournament?: Tournament
  onSubmit: (data: TournamentFormData) => Promise<void>
  isLoading?: boolean
}

export function TournamentForm({ tournament, onSubmit, isLoading = false }: TournamentFormProps) {
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TournamentFormData>({
    resolver: zodResolver(tournamentSchema),
    mode: 'onSubmit',
    defaultValues: tournament ? {
      name: tournament.name,
      description: '',
      startDate: tournament.startDate.split('T')[0],
      endDate: tournament.endDate?.split('T')[0],
      type: tournament.format,
      isPublic: false,
      associationId: tournament.associationId.toString(),
      settings: {
        maxTeams: tournament.maxTeams,
        minTeams: 2,
        teamSize: 2,
        categoryRange: {
          min: Math.min(...tournament.categories),
          max: Math.max(...tournament.categories),
        },
        pointsDistribution: tournament.pointDistribution || {
          '1': 100,
          '2': 70,
          '3': 50,
          '4': 30,
        },
        tiebreakers: ['head_to_head', 'point_difference', 'points_scored'],
      },
    } : {
      isPublic: false,
      settings: {
        teamSize: 2,
        pointsDistribution: {
          '1': 100,
          '2': 70,
          '3': 50,
          '4': 30,
        },
        tiebreakers: ['head_to_head', 'point_difference', 'points_scored'],
      },
    },
  })

  const handleFormSubmit = async (data: TournamentFormData) => {
    setError(null)
    try {
      const submissionData: TournamentFormData = {
        ...data,
        settings: {
          teamSize: data.settings.teamSize || 2,
          pointsDistribution: data.settings.pointsDistribution || {
            '1': 100,
            '2': 70,
            '3': 50,
            '4': 30,
          },
          tiebreakers: data.settings.tiebreakers || ['head_to_head', 'point_difference', 'points_scored'],
          ...(data.settings.maxTeams && { maxTeams: data.settings.maxTeams }),
          ...(data.settings.minTeams && { minTeams: data.settings.minTeams }),
          ...(data.settings.categoryRange && { categoryRange: data.settings.categoryRange }),
        },
      }
      await onSubmit(submissionData)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save tournament. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>General tournament details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tournament Name *</Label>
            <Input
              id="name"
              placeholder="Summer Padel Championship 2024"
              {...register('name')}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Tournament description..."
              {...register('description')}
              disabled={isLoading}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                {...register('startDate')}
                disabled={isLoading}
              />
              {errors.startDate && (
                <p className="text-sm text-destructive">{errors.startDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                {...register('endDate')}
                disabled={isLoading}
              />
              {errors.endDate && (
                <p className="text-sm text-destructive">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tournament Type *</Label>
            <select
              id="type"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...register('type')}
              disabled={isLoading}
            >
              <option value="">Select tournament type</option>
              <option value="single_elimination">Single Elimination</option>
              <option value="double_elimination">Double Elimination</option>
              <option value="round_robin">Round Robin</option>
              <option value="groups_knockout">Groups + Knockout</option>
            </select>
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="associationId">Association ID *</Label>
            <Input
              id="associationId"
              placeholder="UUID of the association"
              {...register('associationId')}
              disabled={isLoading}
            />
            {errors.associationId && (
              <p className="text-sm text-destructive">{errors.associationId.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPublic"
              className="h-4 w-4 rounded border-gray-300"
              {...register('isPublic')}
              disabled={isLoading}
            />
            <Label htmlFor="isPublic" className="font-normal">
              Make tournament public
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tournament Settings</CardTitle>
          <CardDescription>Configure tournament parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="settings.maxTeams">Max Teams</Label>
              <Input
                id="settings.maxTeams"
                type="number"
                min="2"
                placeholder="32"
                {...register('settings.maxTeams', { 
                  setValueAs: (v) => v === '' ? undefined : parseInt(v, 10)
                })}
                disabled={isLoading}
              />
              {errors.settings?.maxTeams && (
                <p className="text-sm text-destructive">{errors.settings.maxTeams.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="settings.minTeams">Min Teams</Label>
              <Input
                id="settings.minTeams"
                type="number"
                min="2"
                placeholder="4"
                {...register('settings.minTeams', { 
                  setValueAs: (v) => v === '' ? undefined : parseInt(v, 10)
                })}
                disabled={isLoading}
              />
              {errors.settings?.minTeams && (
                <p className="text-sm text-destructive">{errors.settings.minTeams.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="settings.teamSize">Team Size *</Label>
              <Input
                id="settings.teamSize"
                type="number"
                min="1"
                max="4"
                defaultValue="2"
                {...register('settings.teamSize', { valueAsNumber: true })}
                disabled={isLoading}
              />
              {errors.settings?.teamSize && (
                <p className="text-sm text-destructive">{errors.settings.teamSize.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category Range</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="settings.categoryRange.min">Min Category</Label>
                <select
                  id="settings.categoryRange.min"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...register('settings.categoryRange.min', { valueAsNumber: true })}
                  disabled={isLoading}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((cat) => (
                    <option key={cat} value={cat}>
                      Category {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings.categoryRange.max">Max Category</Label>
                <select
                  id="settings.categoryRange.max"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...register('settings.categoryRange.max', { valueAsNumber: true })}
                  disabled={isLoading}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((cat) => (
                    <option key={cat} value={cat}>
                      Category {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : tournament ? (
            'Update Tournament'
          ) : (
            'Create Tournament'
          )}
        </Button>
      </div>
    </form>
  )
}
