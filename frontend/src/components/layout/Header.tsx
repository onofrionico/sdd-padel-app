import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Menu, X, Bell, User } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">Padel Tournament</span>
          </Link>

          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/tournaments" className="text-sm font-medium transition-colors hover:text-primary">
                Tournaments
              </Link>
              <Link to="/enrollments" className="text-sm font-medium transition-colors hover:text-primary">
                My Enrollments
              </Link>
              <Link to="/rankings" className="text-sm font-medium transition-colors hover:text-primary">
                Rankings
              </Link>
              <Link to="/associations" className="text-sm font-medium transition-colors hover:text-primary">
                Associations
              </Link>
              {(user?.role === 'organizer' || user?.role === 'admin') && (
                <Link to="/organizer/create" className="text-sm font-medium transition-colors hover:text-primary">
                  Create Tournament
                </Link>
              )}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="icon" className="hidden md:flex" asChild>
                <Link to="/notifications">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="hidden md:flex" asChild>
                <Link to="/profile">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Profile</span>
                </Link>
              </Button>
              <Button variant="outline" onClick={logout} className="hidden md:flex">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild className="hidden md:flex">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="hidden md:flex">
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t md:hidden">
          <nav className="container flex flex-col gap-4 py-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/tournaments"
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tournaments
                </Link>
                <Link
                  to="/enrollments"
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Enrollments
                </Link>
                <Link
                  to="/rankings"
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Rankings
                </Link>
                <Link
                  to="/associations"
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Associations
                </Link>
                <Link
                  to="/notifications"
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Notifications
                </Link>
                <Link
                  to="/profile"
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                {(user?.role === 'organizer' || user?.role === 'admin') && (
                  <Link
                    to="/organizer/create"
                    className="text-sm font-medium transition-colors hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Create Tournament
                  </Link>
                )}
                <Button variant="outline" onClick={logout} className="w-full">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild className="w-full justify-start">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button asChild className="w-full">
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    Register
                  </Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
