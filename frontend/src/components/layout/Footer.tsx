import { Link } from 'react-router-dom'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Padel Tournament</h3>
            <p className="text-sm text-muted-foreground">
              Manage your padel tournaments, enrollments, and rankings all in one place.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/tournaments" className="text-muted-foreground hover:text-foreground">
                  Tournaments
                </Link>
              </li>
              <li>
                <Link to="/rankings" className="text-muted-foreground hover:text-foreground">
                  Rankings
                </Link>
              </li>
              <li>
                <Link to="/associations" className="text-muted-foreground hover:text-foreground">
                  Associations
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/help" className="text-muted-foreground hover:text-foreground">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Padel Tournament Management. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
