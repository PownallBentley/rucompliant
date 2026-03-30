import { Link } from 'react-router-dom'
import { Button } from '@/components/ui'

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
        Compliance That Has Your Back
      </h1>
      <p className="text-lg text-muted-foreground max-w-xl mb-8">
        The simple way for UK small businesses to stay compliant.
        No jargon, no stress — just clear guidance and peace of mind.
      </p>
      <Link to="/auth">
        <Button size="lg">Get Started</Button>
      </Link>
    </div>
  )
}
