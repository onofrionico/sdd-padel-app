import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { playerProfileSchema, PlayerProfileFormData } from '@/lib/validators'
import { authApi } from '@/services/api/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function PlayerProfileForm() {
  const navigate = useNavigate()
  const { updateUser } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlayerProfileFormData>({
    resolver: zodResolver(playerProfileSchema),
  })

  const onSubmit = async (data: PlayerProfileFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const updatedUser = await authApi.updateProfile(data)
      updateUser(updatedUser)
      navigate('/dashboard', { replace: true })
    } catch (err: any) {
      setError(err.response?.data?.message || t('auth.profile.error.default'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    navigate('/dashboard', { replace: true })
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{t('auth.profile.title')}</CardTitle>
        <CardDescription>{t('auth.profile.description')}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">{t('auth.profile.phoneNumber.label')}</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder={t('auth.profile.phoneNumber.placeholder')}
              {...register('phoneNumber')}
              disabled={isLoading}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">{t('auth.profile.gender.label')}</Label>
            <select
              id="gender"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...register('gender')}
              disabled={isLoading}
            >
              <option value="">{t('auth.profile.gender.placeholder')}</option>
              <option value="male">{t('auth.profile.gender.male')}</option>
              <option value="female">{t('auth.profile.gender.female')}</option>
              <option value="other">{t('auth.profile.gender.other')}</option>
            </select>
            {errors.gender && (
              <p className="text-sm text-destructive">{errors.gender.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">{t('auth.profile.dateOfBirth.label')}</Label>
            <Input
              id="dateOfBirth"
              type="date"
              {...register('dateOfBirth')}
              disabled={isLoading}
            />
            {errors.dateOfBirth && (
              <p className="text-sm text-destructive">{errors.dateOfBirth.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="playingHand">{t('auth.profile.playingHand.label')}</Label>
            <select
              id="playingHand"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...register('playingHand')}
              disabled={isLoading}
            >
              <option value="">{t('auth.profile.playingHand.placeholder')}</option>
              <option value="right">{t('auth.profile.playingHand.right')}</option>
              <option value="left">{t('auth.profile.playingHand.left')}</option>
              <option value="ambidextrous">{t('auth.profile.playingHand.ambidextrous')}</option>
            </select>
            {errors.playingHand && (
              <p className="text-sm text-destructive">{errors.playingHand.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="playingStyle">{t('auth.profile.playingStyle.label')}</Label>
            <select
              id="playingStyle"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...register('playingStyle')}
              disabled={isLoading}
            >
              <option value="">{t('auth.profile.playingStyle.placeholder')}</option>
              <option value="defensive">{t('auth.profile.playingStyle.defensive')}</option>
              <option value="offensive">{t('auth.profile.playingStyle.offensive')}</option>
              <option value="all_around">{t('auth.profile.playingStyle.allAround')}</option>
            </select>
            {errors.playingStyle && (
              <p className="text-sm text-destructive">{errors.playingStyle.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('auth.profile.button.submitting')}
              </>
            ) : (
              t('auth.profile.button.submit')
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={handleSkip}
            disabled={isLoading}
          >
            {t('auth.profile.button.skip')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
