import { LoadingSpinner } from '@/components/ui'

export default function AuthCallbackPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <LoadingSpinner size="lg" message="Verifying your link..." centered />
    </div>
  )
}
