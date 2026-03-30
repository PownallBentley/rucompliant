import { Card, AppIcon, Button } from '@/components/ui'

export default function AuthPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <Card padding="lg" className="w-full max-w-md">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <AppIcon name="mail" className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Sign in</h1>
          <p className="text-muted-foreground mb-6">
            Enter your email and we'll send you a magic link
          </p>
          <div className="space-y-4">
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              disabled
            />
            <Button fullWidth disabled>
              Send Magic Link
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Coming soon — authentication will be implemented in a future feature.
          </p>
        </div>
      </Card>
    </div>
  )
}
