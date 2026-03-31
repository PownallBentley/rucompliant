import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { LoadingSpinner } from '@/components/ui'

export default function ProtectedRoute() {
  const { user, loading, onboardingCompleted } = useAuthStore()

  // Still loading auth state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-page">
        <LoadingSpinner size="lg" message="Loading..." centered />
      </div>
    )
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />
  }

  // Onboarding status not yet checked (null = still checking)
  if (onboardingCompleted === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-page">
        <LoadingSpinner size="lg" message="Loading..." centered />
      </div>
    )
  }

  // Onboarding not completed — redirect to onboarding
  if (onboardingCompleted === false) {
    return <Navigate to="/onboarding" replace />
  }

  return <Outlet />
}
