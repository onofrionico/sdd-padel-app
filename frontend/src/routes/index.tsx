import { Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { OrganizerRoute } from './OrganizerRoute'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public routes */}
        <Route path="/" element={<div className="container py-8">Landing Page - Coming Soon</div>} />
        <Route path="/login" element={<div className="container py-8">Login Page - Coming Soon</div>} />
        <Route path="/register" element={<div className="container py-8">Register Page - Coming Soon</div>} />
        
        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div className="container py-8">Dashboard - Coming Soon</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tournaments"
          element={
            <ProtectedRoute>
              <div className="container py-8">Tournaments List - Coming Soon</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tournaments/:id"
          element={
            <ProtectedRoute>
              <div className="container py-8">Tournament Details - Coming Soon</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/enrollments"
          element={
            <ProtectedRoute>
              <div className="container py-8">My Enrollments - Coming Soon</div>
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
