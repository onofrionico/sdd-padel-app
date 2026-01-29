import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { Trophy, Calendar, TrendingUp, Bell } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const quickActions = [
    {
      icon: Trophy,
      title: t('dashboard.quickActions.browseTournaments.title'),
      description: t('dashboard.quickActions.browseTournaments.description'),
      action: () => navigate('/tournaments'),
    },
    {
      icon: Calendar,
      title: t('dashboard.quickActions.myEnrollments.title'),
      description: t('dashboard.quickActions.myEnrollments.description'),
      action: () => navigate('/enrollments'),
    },
    {
      icon: TrendingUp,
      title: t('dashboard.quickActions.rankings.title'),
      description: t('dashboard.quickActions.rankings.description'),
      action: () => navigate('/rankings'),
    },
    {
      icon: Bell,
      title: t('dashboard.quickActions.notifications.title'),
      description: t('dashboard.quickActions.notifications.description'),
      action: () => navigate('/notifications'),
    },
  ]

  return (
    <div className="container py-8 space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {t('dashboard.welcome', { firstName: user?.firstName })}
        </h1>
        <p className="text-muted-foreground">
          {t('dashboard.subtitle')}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{t('dashboard.stats.activeEnrollments')}</CardDescription>
            <CardTitle className="text-3xl">0</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t('dashboard.stats.activeEnrollmentsEmpty')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{t('dashboard.stats.upcomingTournaments')}</CardDescription>
            <CardTitle className="text-3xl">0</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t('dashboard.stats.upcomingTournamentsEmpty')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{t('dashboard.stats.totalPoints')}</CardDescription>
            <CardTitle className="text-3xl">0</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t('dashboard.stats.totalPointsEmpty')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-4">{t('dashboard.quickActions.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Card key={index} className="cursor-pointer hover:bg-accent transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button onClick={action.action} variant="outline" className="w-full">
                    {t('dashboard.quickActions.goTo', { title: action.title })}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold mb-4">{t('dashboard.recentActivity.title')}</h2>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {t('dashboard.recentActivity.empty')}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
