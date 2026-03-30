import LandingNav from "@/components/landing/LandingNav";
import HeroHealthCard from "@/components/landing/HeroHealthCard";
import EmailSignup from "@/components/landing/EmailSignup";
import TrustBadges from "@/components/landing/TrustBadges";
import StatStrip from "@/components/landing/StatStrip";
import SectionHeader from "@/components/landing/SectionHeader";
import FeatureCard from "@/components/landing/FeatureCard";
import NumberedStep from "@/components/landing/NumberedStep";
import PricingCard from "@/components/landing/PricingCard";
import LandingFooter from "@/components/landing/LandingFooter";

const TRUST_STATS = [
  { value: "5.4M", label: "UK businesses" },
  { value: "100%", label: "Plain English — no jargon" },
  { value: "£200+", label: "saved on average" },
];

const PROBLEM_CARDS = [
  {
    icon: "file-text" as const,
    title: "You don't know what you owe",
    description: "Tax rules change constantly. It's impossible to keep track of exactly what you need to pay and when without an expert.",
  },
  {
    icon: "calendar-x" as const,
    title: "Deadlines you've never heard of",
    description: "Confirmation statements, VAT quarters, PAYE deadlines. Missing just one can trigger immediate automatic fines.",
  },
  {
    icon: "alert-triangle" as const,
    title: "Penalties that arrive without warning",
    description: "HMRC doesn't send friendly reminders. They send brown envelopes with late filing penalties that compound daily.",
  },
];

const HOW_IT_WORKS_STEPS = [
  {
    title: "Answer 5 quick questions about your business.",
    description: "Tell us how you operate, and we'll figure out exactly which regulations apply to you. No legal jargon, just plain English.",
  },
  {
    title: "Get your personalised compliance picture instantly.",
    description: "See your overall Health Score and a clear, prioritised list of exactly what you need to do to get fully compliant today.",
  },
  {
    title: "We remind you before anything goes wrong — automatically.",
    description: "Never miss a deadline again. We'll send you simple, actionable alerts weeks before anything is due, keeping you in the green.",
  },
];

const MONTHLY_FEATURES = [
  { text: "Full compliance health check" },
  { text: "Automated deadline reminders" },
  { text: "Plain English guidance" },
  { text: "Document storage vault" },
  { text: "AI Compliance Advisor" },
  { text: "Email & chat support" },
];

const ANNUAL_FEATURES = [
  { text: "Everything in Monthly, plus:", bold: true },
  { text: "Priority onboarding support" },
  { text: "Annual compliance review call" },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-page">
      {/* NAV */}
      <LandingNav />

      <main className="flex-grow w-full">
        {/* HERO */}
        <section className="relative w-full min-h-[90vh] lg:min-h-[85vh] flex items-center justify-center pt-10 pb-20 px-4 md:px-8 overflow-hidden">
          <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 relative z-10">
            {/* Hero Content */}
            <div className="w-full lg:w-[620px] flex flex-col items-center lg:items-start text-center lg:text-left z-20">
              <h1 className="font-extrabold text-[40px] md:text-[50px] lg:text-[60px] text-foreground leading-[1.1] tracking-[-1.5px] mb-6">
                Are you compliant?
              </h1>
              <p className="font-normal text-lg md:text-xl text-muted-foreground leading-relaxed max-w-[560px] mb-10">
                RUCompliant walks every UK microbusiness through exactly what they need to do — in plain English, in the right order, before deadlines hit.
              </p>

              <EmailSignup variant="light" className="mb-6" />
              <TrustBadges />
            </div>

            {/* Hero Graphic */}
            <HeroHealthCard />
          </div>
        </section>

        {/* TRUST STRIP */}
        <StatStrip stats={TRUST_STATS} />

        {/* PROBLEM SECTION */}
        <section className="w-full bg-page py-24 px-4">
          <div className="max-w-6xl mx-auto flex flex-col items-center">
            <SectionHeader
              title="Nobody told you about this."
              subtitle="Most microbusinesses are not non-compliant by choice. They just don't know what they don't know."
              className="mb-16"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {PROBLEM_CARDS.map((card) => (
                <FeatureCard key={card.title} {...card} />
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="w-full bg-white py-24 px-4 border-y border-border">
          <div className="max-w-[560px] mx-auto flex flex-col items-center">
            <h2 className="font-extrabold text-[32px] md:text-[40px] text-foreground leading-[1.2] tracking-tight mb-16 text-center">
              Sorted in 3 steps.
            </h2>

            <div className="w-full flex flex-col gap-8">
              {HOW_IT_WORKS_STEPS.map((step, i) => (
                <NumberedStep
                  key={i}
                  number={i + 1}
                  title={step.title}
                  description={step.description}
                  isLast={i === HOW_IT_WORKS_STEPS.length - 1}
                />
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="w-full bg-page py-24 px-4">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <SectionHeader
              title="Simple, transparent pricing."
              subtitle="One plan, everything included. Pay monthly or save with annual."
              className="mb-16"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[960px]">
              <PricingCard
                name="Monthly"
                price="£49.99"
                period="/month"
                subtitle="Cancel anytime"
                features={MONTHLY_FEATURES}
              />
              <PricingCard
                name="Annual"
                price="£499.99"
                period="/year"
                subtitle="2 months free"
                features={ANNUAL_FEATURES}
                highlighted
                badge="Most popular"
              />
            </div>

            <div className="mt-8 text-center">
              <span className="text-[13px] font-medium text-muted-foreground">
                14-day free trial &middot; No credit card required
              </span>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="w-full bg-black py-20 px-4">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
            <h2 className="font-extrabold text-[40px] md:text-[48px] text-white leading-[1.1] tracking-tight mb-4">
              Ready to find out?
            </h2>
            <p className="font-normal text-base text-muted-foreground mb-10">
              Takes 2 minutes. No credit card.
            </p>

            <EmailSignup variant="dark" />
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <LandingFooter />
    </div>
  );
}
