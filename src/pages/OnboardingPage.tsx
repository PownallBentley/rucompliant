import { Card, AppIcon } from '@/components/ui'

export default function OnboardingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <Card padding="lg" className="w-full max-w-lg text-center">
        <div className="flex justify-center mb-4">
          <AppIcon name="rocket" className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Let's set up your business
        </h1>
        <p className="text-muted-foreground">
          Coming soon — onboarding flow will be built in F-009.
        </p>
      </Card>
    </div>
  )
}
