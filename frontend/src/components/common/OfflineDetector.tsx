import { useEffect, useState } from 'react'
import { WifiOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function OfflineDetector() {
  const { t } = useTranslation()
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div 
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-destructive text-destructive-foreground px-4 py-3 rounded-lg shadow-lg flex items-center gap-2"
      role="alert"
      aria-live="assertive"
    >
      <WifiOff className="h-5 w-5" />
      <span className="text-sm font-medium">{t('offline.message')}</span>
    </div>
  )
}
