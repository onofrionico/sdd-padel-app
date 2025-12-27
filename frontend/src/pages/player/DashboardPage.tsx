import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { Trophy, Calendar, TrendingUp, Bell } from 'lucide-react'

export function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const quickActions = [
    {
      icon: Trophy,
      title: 'Browse Tournaments',
      description: 'Find and enroll in upcoming tournaments',
      action: () => navigate('/tournaments'),
    },
    {
      icon: Calendar,
      title: 'My Enrollments',
      description: 'View your tournament enrollments',
      action: () => navigate('/enrollments'),
    },
    {
      icon: TrendingUp,
      title: 'Rankings',
      description: 'Check your ranking and statistics',
      action: () => navigate('/rankings'),
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'View your latest notifications',
      action: () => navigate('/notifications'),
    },
  ]

  return (
    <div className="container py-8 space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your tournaments
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Enrollments</CardDescription>
            <CardTitle className="text-3xl">0</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No active enrollments yet
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Upcoming Tournaments</CardDescription>
            <CardTitle className="text-3xl">0</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Browse tournaments to get started
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Points</CardDescription>
            <CardTitle className="text-3xl">0</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Earn points by participating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
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
                    Go to {action.title}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No recent activity yet. Start by enrolling in a tournament!
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
