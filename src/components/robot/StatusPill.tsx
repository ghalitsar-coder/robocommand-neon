import { cn } from "@/lib/utils";

interface StatusPillProps {
  label: string;
  tone?: "ok" | "warn" | "danger" | "idle";
  pulse?: boolean;
}

export function StatusPill({ label, tone = "ok", pulse }: StatusPillProps) {
  const map = {
    ok: "text-neon-green border-neon-green/50 bg-neon-green/10",
    warn: "text-neon-amber border-neon-amber/50 bg-neon-amber/10",
    danger: "text-destructive border-destructive/50 bg-destructive/10",
    idle: "text-muted-foreground border-border bg-muted/30",
  } as const;
  const dotMap = {
    ok: "bg-neon-green shadow-[0_0_10px_var(--neon-green)]",
    warn: "bg-neon-amber shadow-[0_0_10px_var(--neon-amber)]",
    danger: "bg-destructive shadow-[0_0_10px_oklch(0.65_0.27_25)]",
    idle: "bg-muted-foreground",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-2.5 py-1 rounded-md border font-mono text-[10px] uppercase tracking-widest",
        map[tone],
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dotMap[tone], pulse && "animate-pulse")} />
      {label}
    </span>
  );
}
