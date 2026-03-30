import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface EmailSignupProps {
  variant?: "light" | "dark";
  className?: string;
}

export default function EmailSignup({ variant = "light", className }: EmailSignupProps) {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/auth?email=${encodeURIComponent(email)}`);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("w-full max-w-[480px]", className)}>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="hello@yourbusiness.co.uk"
          required
          className={cn(
            "flex-1 h-[44px] px-4 rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-primary transition-all",
            variant === "light"
              ? "border border-border bg-white text-foreground placeholder-muted-foreground"
              : "border-none bg-page text-foreground placeholder-muted-foreground"
          )}
        />
        <button
          type="submit"
          className="h-[44px] px-6 bg-magenta text-white font-bold text-[15px] rounded-lg hover:bg-magenta-600 transition-colors whitespace-nowrap"
        >
          Get started free
        </button>
      </div>
    </form>
  );
}
