import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { LoadingSpinner } from '@/components/ui'

export default function ProtectedRoute() {
  const { user, loading } = useAuthStore()

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

  // Future: check onboarding completion (F-009)
  // For now, authenticated users go straight through
  return <Outlet />
}
