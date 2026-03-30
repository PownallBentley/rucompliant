import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PublicLayout from '@/components/layout/PublicLayout'
import AppLayout from '@/components/layout/AppLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import LandingPage from '@/pages/LandingPage'
import AuthPage from '@/pages/AuthPage'
import AuthCallbackPage from '@/pages/AuthCallbackPage'
import OnboardingPage from '@/pages/OnboardingPage'
import DashboardPage from '@/pages/DashboardPage'
import ConciergePage from '@/pages/ConciergePage'
import CalendarPage from '@/pages/CalendarPage'
import DocumentsPage from '@/pages/DocumentsPage'
import SettingsPage from '@/pages/SettingsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page — full width, own nav */}
        <Route path="/" element={<LandingPage />} />

        {/* Public routes with centered layout */}
        <Route element={<PublicLayout />}>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Route>

        {/* Protected app routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/app/dashboard" element={<DashboardPage />} />
            <Route path="/app/journey" element={<ConciergePage />} />
            <Route path="/app/calendar" element={<CalendarPage />} />
            <Route path="/app/documents" element={<DocumentsPage />} />
            <Route path="/app/settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
