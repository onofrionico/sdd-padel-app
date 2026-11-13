import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { NotificationBell } from '@/components/notifications/NotificationBell'
import { LanguageSelector } from '@/components/common/LanguageSelector'
import { Menu, X, User } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2" aria-label={t('header.aria.home')}>
            <span className="text-xl font-bold text-primary">{t('header.appName')}</span>
          </Link>

          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
              <Link 
                to="/tournaments" 
                className="text-sm font-medium transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-1"
              >
                {t('header.nav.tournaments')}
              </Link>
              <Link 
                to="/enrollments" 
                className="text-sm font-medium transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-1"
              >
                {t('header.nav.myEnrollments')}
              </Link>
              <Link 
                to="/rankings" 
                className="text-sm font-medium transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-1"
              >
                {t('header.nav.rankings')}
              </Link>
              <Link 
                to="/associations" 
                className="text-sm font-medium transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-1"
              >
                {t('header.nav.associations')}
              </Link>
              {(user?.role === 'organizer' || user?.role === 'admin') && (
                <Link 
                  to="/organizer/tournaments/create" 
                  className="text-sm font-medium transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-1"
                >
                  {t('header.nav.createTournament')}
                </Link>
              )}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <div className="hidden md:flex">
                <NotificationBell />
              </div>
              <Button variant="ghost" size="icon" className="hidden md:flex" asChild>
                <Link to="/profile">
                  <User className="h-5 w-5" />
                  <span className="sr-only">{t('header.aria.profile')}</span>
                </Link>
              </Button>
              <div className="hidden md:flex">
                <LanguageSelector />
              </div>
              <Button variant="outline" onClick={logout} className="hidden md:flex">
                {t('header.button.logout')}
              </Button>
            </>
          ) : (
            <>
              <div className="hidden md:flex">
                <LanguageSelector />
              </div>
              <Button variant="ghost" asChild className="hidden md:flex">
                <Link to="/login">{t('header.button.login')}</Link>
              </Button>
              <Button asChild className="hidden md:flex">
                <Link to="/register">{t('header.button.register')}</Link>
              </Button>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? t('header.aria.closeMenu') : t('header.aria.openMenu')}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">{mobileMenuOpen ? t('header.aria.closeMenu') : t('header.aria.openMenu')}</span>
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t md:hidden" id="mobile-menu">
          <nav className="container flex flex-col gap-4 py-4" aria-label="Mobile navigation">
            {isAuthenticated ? (
              <>
                <Link
                  to="/tournaments"
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('header.nav.tournaments')}
                </Link>
                <Link
                  to="/enrollments"
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('header.nav.myEnrollments')}
                </Link>
                <Link
                  to="/rankings"
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('header.nav.rankings')}
                </Link>
                <Link
                  to="/associations"
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('header.nav.associations')}
                </Link>
                <Link
                  to="/notifications"
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('header.nav.notifications')}
                </Link>
                <Link
                  to="/profile"
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('header.nav.profile')}
                </Link>
                {(user?.role === 'organizer' || user?.role === 'admin') && (
                  <Link
                    to="/organizer/tournaments/create"
                    className="text-sm font-medium transition-colors hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('header.nav.createTournament')}
                  </Link>
                )}
                <Button variant="outline" onClick={logout} className="w-full">
                  {t('header.button.logout')}
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild className="w-full justify-start">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    {t('header.button.login')}
                  </Link>
                </Button>
                <Button asChild className="w-full">
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    {t('header.button.register')}
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
