import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { t } = useTranslation()

  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">{t('footer.appName')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('footer.description')}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">{t('footer.section.platform')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/tournaments" className="text-muted-foreground hover:text-foreground">
                  {t('footer.link.tournaments')}
                </Link>
              </li>
              <li>
                <Link to="/rankings" className="text-muted-foreground hover:text-foreground">
                  {t('footer.link.rankings')}
                </Link>
              </li>
              <li>
                <Link to="/associations" className="text-muted-foreground hover:text-foreground">
                  {t('footer.link.associations')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">{t('footer.section.support')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/help" className="text-muted-foreground hover:text-foreground">
                  {t('footer.link.helpCenter')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground">
                  {t('footer.link.contactUs')}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-foreground">
                  {t('footer.link.faq')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">{t('footer.section.legal')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground">
                  {t('footer.link.privacy')}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground">
                  {t('footer.link.terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} {t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  )
}
