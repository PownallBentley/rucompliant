import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import QuestionFlow from "@/components/shared/QuestionFlow";
import type { QuestionFlowStep } from "@/components/shared/QuestionStep";
import { LoadingSpinner } from "@/components/ui";
import { useAuthStore } from "@/stores/authStore";
import { completeOnboarding } from "@/services/onboardingService";

const BUSINESS_SECTORS = [
  "Retail",
  "Hospitality",
  "Professional services",
  "Health & beauty",
  "Construction",
  "Digital & tech",
  "Creative",
  "Food & drink",
  "Property",
  "Health & care",
  "Education",
  "Other",
];

const ONBOARDING_STEPS: QuestionFlowStep[] = [
  {
    id: "business_structure",
    type: "choice",
    question: "How is your business set up?",
    description: "This helps us know which compliance rules apply to you.",
    options: [
      { value: "sole_trader", label: "Sole trader / Self-employed", icon: "briefcase", description: "You run the business yourself" },
      { value: "limited_company", label: "Limited company", icon: "landmark", description: "You have a registered Ltd company" },
      { value: "partnership", label: "Partnership", icon: "users", description: "You run it with one or more partners" },
      { value: "not_sure", label: "Not sure yet", icon: "question", description: "We'll help you work it out" },
    ],
  },
  {
    id: "headcount",
    type: "number-picker",
    question: "How many people work in your business?",
    description: "Including you. This determines your employment obligations.",
    options: [
      { value: "just_me", label: "Just me" },
      { value: "2_4", label: "2–4" },
      { value: "5_9", label: "5–9" },
      { value: "10_plus", label: "10+" },
    ],
  },
  {
    id: "vat_registered",
    type: "yes-no-unsure",
    question: "Are you VAT registered?",
    description: "If you're not sure, choose No — you can update this later.",
    tooltip: "Most businesses register for VAT once their annual income reaches £90,000. If you're below that, you're probably not registered.",
  },
  {
    id: "sector",
    type: "searchable-list",
    question: "What type of business do you run?",
    description: "Pick the closest match — you can update this later.",
    searchItems: BUSINESS_SECTORS,
  },
  {
    id: "trading_start_date",
    type: "month-year-picker",
    question: "When did your business start trading?",
    description: "This helps us work out which deadlines already apply to you.",
    skipLabel: "We haven't started trading yet",
  },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, setOnboardingCompleted } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleComplete = async (answers: Record<string, string>) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await completeOnboarding(user.id, answers);
      setOnboardingCompleted(true);
      navigate("/app/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSaving(false);
    }
  };

  if (saving) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="bg-white rounded-xl border border-border p-10 w-full max-w-[560px] text-center">
          {/* Logo */}
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-extrabold text-2xl">R</span>
          </div>

          <LoadingSpinner size="lg" className="mb-6" />

          <h2 className="font-extrabold text-xl text-foreground mb-2">
            Building your compliance picture...
          </h2>
          <p className="text-sm text-muted-foreground">
            We're setting up your personalised dashboard. This takes just a moment.
          </p>
        </div>

        {/* Background decorative elements */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-dusk/5 rounded-full blur-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-page">
      {/* Top bar */}
      <header className="h-12 bg-page w-full flex items-center justify-between px-6 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-black rounded-md flex items-center justify-center">
            <span className="text-primary font-extrabold text-sm leading-none">R</span>
          </div>
          <span className="font-extrabold text-base text-foreground tracking-tight hidden sm:block">
            RUCompliant
          </span>
        </Link>
      </header>

      {/* Question flow */}
      <main className="flex-grow flex flex-col items-center pt-8 px-4 pb-24">
        {error && (
          <div className="w-full max-w-[560px] mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl border border-border p-6 sm:p-10 w-full max-w-[560px]">
          <QuestionFlow
            steps={ONBOARDING_STEPS}
            onComplete={handleComplete}
            title="Set up your business"
          />
        </div>
      </main>

      {/* Background decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-dusk/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
