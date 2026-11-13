import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { OrganizerRoute } from './OrganizerRoute'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

const LandingPage = lazy(() => import('@/pages/public/LandingPage').then(m => ({ default: m.LandingPage })))
const LoginPage = lazy(() => import('@/pages/public/LoginPage').then(m => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('@/pages/public/RegisterPage').then(m => ({ default: m.RegisterPage })))
const ProfileSetupPage = lazy(() => import('@/pages/player/ProfileSetupPage').then(m => ({ default: m.ProfileSetupPage })))
const DashboardPage = lazy(() => import('@/pages/player/DashboardPage').then(m => ({ default: m.DashboardPage })))
const MyEnrollmentsPage = lazy(() => import('@/pages/player/MyEnrollmentsPage').then(m => ({ default: m.MyEnrollmentsPage })))
const NotificationsPage = lazy(() => import('@/pages/player/NotificationsPage').then(m => ({ default: m.NotificationsPage })))
const ProfilePage = lazy(() => import('@/pages/player/ProfilePage').then(m => ({ default: m.ProfilePage })))
const TournamentsListPage = lazy(() => import('@/pages/shared/TournamentsListPage').then(m => ({ default: m.TournamentsListPage })))
const TournamentDetailsPage = lazy(() => import('@/pages/shared/TournamentDetailsPage').then(m => ({ default: m.TournamentDetailsPage })))
const RankingsPage = lazy(() => import('@/pages/shared/RankingsPage').then(m => ({ default: m.RankingsPage })))
const AssociationsListPage = lazy(() => import('@/pages/shared/AssociationsListPage').then(m => ({ default: m.AssociationsListPage })))
const AssociationDetailsPage = lazy(() => import('@/pages/shared/AssociationDetailsPage').then(m => ({ default: m.AssociationDetailsPage })))
const OrganizerDashboardPage = lazy(() => import('@/pages/organizer/OrganizerDashboardPage').then(m => ({ default: m.OrganizerDashboardPage })))
const CreateTournamentPage = lazy(() => import('@/pages/organizer/CreateTournamentPage').then(m => ({ default: m.CreateTournamentPage })))
const EditTournamentPage = lazy(() => import('@/pages/organizer/EditTournamentPage').then(m => ({ default: m.EditTournamentPage })))
const ManageTournamentPage = lazy(() => import('@/pages/organizer/ManageTournamentPage').then(m => ({ default: m.ManageTournamentPage })))
const ManageEnrollmentsPage = lazy(() => import('@/pages/organizer/ManageEnrollmentsPage').then(m => ({ default: m.ManageEnrollmentsPage })))
const PaymentPage = lazy(() => import('@/pages/payments/PaymentPage').then(m => ({ default: m.PaymentPage })))
const TournamentPaymentsPage = lazy(() => import('@/pages/payments/TournamentPaymentsPage').then(m => ({ default: m.TournamentPaymentsPage })))
const NotFoundPage = lazy(() => import('@/pages/public/NotFoundPage').then(m => ({ default: m.NotFoundPage })))

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <LoadingSpinner size="lg" />
  </div>
)

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<MainLayout />}>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected routes */}
        <Route
          path="/profile-setup"
          element={
            <ProtectedRoute>
              <ProfileSetupPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tournaments"
          element={
            <ProtectedRoute>
              <TournamentsListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tournaments/:id"
          element={
            <ProtectedRoute>
              <TournamentDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/enrollments"
          element={
            <ProtectedRoute>
              <MyEnrollmentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rankings"
          element={
            <ProtectedRoute>
              <RankingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/associations"
          element={
            <ProtectedRoute>
              <AssociationsListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/associations/:id"
          element={
            <ProtectedRoute>
              <AssociationDetailsPage />
            </ProtectedRoute>
          }
        />

        {/* Payment routes */}
        <Route
          path="/payments/enrollments/:enrollmentId"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />

        {/* Organizer routes */}
        <Route
          path="/organizer/dashboard"
          element={
            <OrganizerRoute>
              <OrganizerDashboardPage />
            </OrganizerRoute>
          }
        />
        <Route
          path="/organizer/tournaments/create"
          element={
            <OrganizerRoute>
              <CreateTournamentPage />
            </OrganizerRoute>
          }
        />
        <Route
          path="/organizer/tournaments/:id"
          element={
            <OrganizerRoute>
              <ManageTournamentPage />
            </OrganizerRoute>
          }
        />
        <Route
          path="/organizer/tournaments/:id/edit"
          element={
            <OrganizerRoute>
              <EditTournamentPage />
            </OrganizerRoute>
          }
        />
        <Route
          path="/organizer/tournaments/:id/enrollments"
          element={
            <OrganizerRoute>
              <ManageEnrollmentsPage />
            </OrganizerRoute>
          }
        />
        <Route
          path="/organizer/tournaments/:id/payments"
          element={
            <OrganizerRoute>
              <TournamentPaymentsPage />
            </OrganizerRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
    </Suspense>
  )
}
