import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Users, Calendar, TrendingUp } from 'lucide-react'
import { useEffect } from 'react'

export function LandingPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const features = [
    {
      icon: Trophy,
      title: 'Tournament Management',
      description: 'Create and manage padel tournaments with customizable formats and scoring systems',
    },
    {
      icon: Users,
      title: 'Team Enrollment',
      description: 'Easily enroll with partners and track your tournament participation',
    },
    {
      icon: TrendingUp,
      title: 'Rankings & Statistics',
      description: 'View category-specific rankings and track your performance over time',
    },
    {
      icon: Calendar,
      title: 'Schedule & Notifications',
      description: 'Stay updated with match schedules and tournament announcements',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to Padel Tournament Manager
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            The complete platform for organizing, participating, and tracking padel tournaments
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/register')} className="text-lg px-8">
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/login')}
              className="text-lg px-8"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Everything You Need
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Playing?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of players and organizers using our platform
          </p>
          <Button size="lg" onClick={() => navigate('/register')} className="text-lg px-8">
            Create Your Account
          </Button>
        </div>
      </section>
    </div>
  )
}
