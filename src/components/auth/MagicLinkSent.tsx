import AppIcon from "@/components/ui/AppIcon";

interface MagicLinkSentProps {
  email: string;
  onResend: () => void;
}

export default function MagicLinkSent({ email, onResend }: MagicLinkSentProps) {
  return (
    <div className="text-center py-4">
      <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center">
        <AppIcon name="mail" className="w-12 h-12 text-primary" />
      </div>

      <h2 className="font-extrabold text-[22px] text-foreground mb-3">
        Check your email
      </h2>

      <p className="font-normal text-sm text-muted-foreground leading-relaxed mb-6 max-w-[280px] mx-auto">
        We sent a magic link to <strong className="text-foreground">{email}</strong> — click it to sign in. It expires in 15 minutes.
      </p>

      <button
        type="button"
        onClick={onResend}
        className="text-sm font-semibold text-primary hover:underline"
      >
        Resend the link
      </button>
    </div>
  );
}
