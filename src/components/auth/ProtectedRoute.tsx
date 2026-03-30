import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { LoadingSpinner } from '@/components/ui'

export default function ProtectedRoute() {
  const { user, loading, onboardingCompleted } = useAuthStore()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-page">
        <LoadingSpinner size="lg" message="Loading..." centered />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  if (onboardingCompleted === false) {
    return <Navigate to="/onboarding" replace />
  }

  return <Outlet />
}
