import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoadingSpinner } from '@/components/ui'
import { useAuthStore } from '@/stores/authStore'

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const { user, loading, onboardingCompleted } = useAuthStore()

  useEffect(() => {
    if (loading) return

    if (!user) {
      // Auth failed or expired — send back to auth page
      navigate('/auth', { replace: true })
      return
    }

    if (onboardingCompleted) {
      navigate('/app/dashboard', { replace: true })
    } else {
      navigate('/onboarding', { replace: true })
    }
  }, [user, loading, onboardingCompleted, navigate])

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <LoadingSpinner size="lg" message="Verifying your link..." centered />
    </div>
  )
}
