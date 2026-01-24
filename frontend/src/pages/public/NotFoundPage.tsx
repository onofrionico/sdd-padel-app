import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft } from 'lucide-react'
import { SEOHead } from '@/components/common/SEOHead'

export function NotFoundPage() {
  return (
    <>
      <SEOHead 
        title="Page Not Found"
        description="The page you are looking for does not exist."
      />
      <div className="container flex flex-col items-center justify-center min-h-[60vh] py-12">
        <div className="text-center space-y-6 max-w-md">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <h2 className="text-3xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild variant="default">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <Button asChild variant="outline" onClick={() => window.history.back()}>
              <span className="cursor-pointer">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </span>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
