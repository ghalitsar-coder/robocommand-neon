interface BatteryIndicatorProps {
  level: number;
  voltage?: number;
}

export function BatteryIndicator({ level, voltage }: BatteryIndicatorProps) {
  const pct = Math.max(0, Math.min(100, level));
  const tone =
    pct > 50 ? "var(--success)" : pct > 20 ? "var(--warning)" : "var(--destructive)";

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <span className="label-eyebrow">Battery</span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold tabular-nums text-foreground">
            {pct.toFixed(0)}
            <span className="text-sm font-normal text-muted-foreground ml-0.5">%</span>
          </span>
          {voltage !== undefined && (
            <span className="font-mono text-xs text-muted-foreground tabular-nums">
              {voltage.toFixed(2)}V
            </span>
          )}
        </div>
      </div>
      <div className="relative h-2 rounded-full bg-surface-muted overflow-hidden border border-border">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: tone }}
        />
      </div>
      <div className="flex justify-between font-mono text-[10px] text-muted-foreground tracking-wider">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  );
}
