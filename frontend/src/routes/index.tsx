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
import { NotificationsPage } from '@/pages/player/NotificationsPage'
import { ProfilePage } from '@/pages/player/ProfilePage'
import { TournamentsListPage } from '@/pages/shared/TournamentsListPage'
import { TournamentDetailsPage } from '@/pages/shared/TournamentDetailsPage'
import { RankingsPage } from '@/pages/shared/RankingsPage'
import { OrganizerDashboardPage } from '@/pages/organizer/OrganizerDashboardPage'
import { CreateTournamentPage } from '@/pages/organizer/CreateTournamentPage'
import { EditTournamentPage } from '@/pages/organizer/EditTournamentPage'
import { ManageTournamentPage } from '@/pages/organizer/ManageTournamentPage'
import { ManageEnrollmentsPage } from '@/pages/organizer/ManageEnrollmentsPage'

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
              <div className="container py-8">Associations - Coming Soon</div>
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

        {/* 404 */}
        <Route path="*" element={<div className="container py-8">404 - Page Not Found</div>} />
      </Route>
    </Routes>
  )
}
