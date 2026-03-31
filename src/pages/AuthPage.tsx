import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import AppIcon from "@/components/ui/AppIcon";
import { signUp, signIn } from "@/services/authService";

/**
 * TEMPORARY: Email + password auth for development.
 * Will be replaced with Google/Microsoft OAuth + Email OTP for production.
 */

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialMode = searchParams.get("mode") === "signin" ? "signin" : "signup";
  const [mode, setMode] = useState<"signup" | "signin">(initialMode);
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isSignIn = mode === "signin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignIn) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      // Let AuthProvider detect session change, then route based on onboarding status
      // Small delay to let onAuthStateChange fire and check onboarding
      navigate("/app/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="bg-white rounded-xl border border-border p-10 w-full max-w-[440px]">
        {/* Logo */}
        <div className="flex flex-col items-center justify-center mb-8">
          <Link to="/" className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-primary font-extrabold text-lg leading-none">R</span>
            </div>
            <span className="font-extrabold text-lg text-foreground tracking-tight">RUCompliant</span>
          </Link>
        </div>

        {/* Headers */}
        <div className="text-center mb-6">
          <h1 className="font-extrabold text-[28px] text-foreground leading-tight tracking-[-0.3px] mb-2">
            {isSignIn ? "Welcome back" : "Create your free account"}
          </h1>
          <p className="font-normal text-sm text-muted-foreground">
            {isSignIn
              ? "Sign in to your account."
              : "Takes 2 minutes. No credit card needed."}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full mb-4">
          <div className="mb-4">
            <label htmlFor="email" className="block font-semibold text-xs text-foreground mb-2">
              Email address
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hello@yourbusiness.co.uk"
              className="w-full h-[44px] px-4 rounded-lg border border-border bg-white text-[15px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-muted-foreground transition-all"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block font-semibold text-xs text-foreground mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isSignIn ? "Enter your password" : "Create a password (6+ characters)"}
              className="w-full h-[44px] px-4 rounded-lg border border-border bg-white text-[15px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-muted-foreground transition-all"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive mb-4">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[44px] bg-magenta text-white font-bold text-base rounded-lg hover:bg-magenta-600 transition-colors flex items-center justify-center mb-4 disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : isSignIn
                ? "Sign in"
                : "Create my account"}
          </button>
        </form>

        {/* Dev notice */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <AppIcon name="lock" className="w-3 h-3 text-muted-foreground" />
          <p className="font-normal text-xs text-muted-foreground text-center max-w-[280px]">
            Development mode — email + password. Production will use Google/Microsoft sign-in.
          </p>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-border my-4" />

        {/* Toggle mode */}
        <div className="text-center mb-6">
          {isSignIn ? (
            <>
              <span className="text-[13px] text-muted-foreground">Don't have an account?</span>
              <button
                type="button"
                onClick={() => { setMode("signup"); setError(""); }}
                className="text-[13px] font-semibold text-primary hover:underline ml-1"
              >
                Create one free
              </button>
            </>
          ) : (
            <>
              <span className="text-[13px] text-muted-foreground">Already have an account?</span>
              <button
                type="button"
                onClick={() => { setMode("signin"); setError(""); }}
                className="text-[13px] font-semibold text-primary hover:underline ml-1"
              >
                Sign in
              </button>
            </>
          )}
        </div>

        {/* Terms */}
        <div className="text-center">
          <p className="text-[11px] text-muted-foreground/60">
            By continuing you agree to our{" "}
            <Link to="#" className="text-dusk hover:underline">Terms</Link> and{" "}
            <Link to="#" className="text-dusk hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-dusk/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
