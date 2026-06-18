import { ShieldAlert } from "lucide-react";

export function AIDisclaimer({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-start gap-2 rounded-xl border border-warning/40 bg-warning/10 px-3 py-2 text-xs text-muted-foreground ${className}`}
    >
      <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning-foreground/80" />
      <p>
        <span className="font-semibold text-foreground">AI guidance only.</span>{" "}
        Review suggestions carefully before making career decisions.
      </p>
    </div>
  );
}
