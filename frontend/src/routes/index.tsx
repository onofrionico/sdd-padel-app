import { Routes, Route } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { OrganizerRoute } from './OrganizerRoute'
import { LandingPage } from '@/pages/public/LandingPage'
import { LoginPage } from '@/pages/public/LoginPage'
import { RegisterPage } from '@/pages/public/RegisterPage'
import { ProfileSetupPage } from '@/pages/player/ProfileSetupPage'
import { DashboardPage } from '@/pages/player/DashboardPage'
import { MyEnrollmentsPage } from '@/pages/player/MyEnrollmentsPage'
import { TournamentsListPage } from '@/pages/shared/TournamentsListPage'
import { TournamentDetailsPage } from '@/pages/shared/TournamentDetailsPage'

export function AppRoutes() {
  return (
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
              <div className="container py-8">Rankings - Coming Soon</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <div className="container py-8">Profile - Coming Soon</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <div className="container py-8">Notifications - Coming Soon</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/associations"
          element={
            <ProtectedRoute>
              <div className="container py-8">Associations - Coming Soon</div>
            </ProtectedRoute>
          }
        />

        {/* Organizer routes */}
        <Route
          path="/organizer/create"
          element={
            <OrganizerRoute>
              <div className="container py-8">Create Tournament - Coming Soon</div>
            </OrganizerRoute>
          }
        />
        <Route
          path="/organizer/manage/:id"
          element={
            <OrganizerRoute>
              <div className="container py-8">Manage Tournament - Coming Soon</div>
            </OrganizerRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<div className="container py-8">404 - Page Not Found</div>} />
      </Route>
    </Routes>
  )
}
