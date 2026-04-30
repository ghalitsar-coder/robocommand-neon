import { cn } from "@/lib/utils";

interface StatusPillProps {
  label: string;
  tone?: "ok" | "warn" | "danger" | "idle";
  pulse?: boolean;
}

export function StatusPill({ label, tone = "ok", pulse }: StatusPillProps) {
  const map = {
    ok: "text-[color:var(--success)] border-border bg-surface-muted",
    warn: "text-[color:var(--warning)] border-border bg-surface-muted",
    danger: "text-destructive border-border bg-surface-muted",
    idle: "text-muted-foreground border-border bg-surface-muted",
  } as const;
  const dotMap = {
    ok: "bg-[color:var(--success)]",
    warn: "bg-[color:var(--warning)]",
    danger: "bg-destructive",
    idle: "bg-muted-foreground",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-2.5 py-1 rounded-md border font-mono text-[10px] uppercase tracking-wider font-medium",
        map[tone],
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dotMap[tone], pulse && "animate-pulse")} />
      {label}
    </span>
  );
}
