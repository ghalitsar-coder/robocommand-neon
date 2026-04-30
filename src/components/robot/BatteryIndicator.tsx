interface BatteryIndicatorProps {
  /** 0..100 */
  level: number;
  voltage?: number;
}

export function BatteryIndicator({ level, voltage }: BatteryIndicatorProps) {
  const pct = Math.max(0, Math.min(100, level));
  const tone = pct > 50 ? "var(--neon-green)" : pct > 20 ? "var(--neon-amber)" : "oklch(0.65 0.27 25)";

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Power Cell
        </span>
        <span className="font-display text-3xl tabular-nums" style={{ color: tone, textShadow: `0 0 14px ${tone}` }}>
          {pct.toFixed(0)}<span className="text-xs ml-1 opacity-70">%</span>
        </span>
      </div>
      <div className="relative h-10 rounded-md border-2 border-border bg-background/60 overflow-hidden">
        <div
          className="h-full transition-all duration-500 relative"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, color-mix(in oklab, ${tone} 50%, transparent), ${tone})`,
            boxShadow: `inset 0 0 18px ${tone}`,
          }}
        >
          <div className="absolute inset-0 flex">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex-1 border-r border-background/40 last:border-r-0" />
            ))}
          </div>
        </div>
      </div>
      {voltage !== undefined && (
        <div className="font-mono text-xs text-muted-foreground flex justify-between">
          <span>VOLT</span>
          <span className="text-foreground">{voltage.toFixed(2)} V</span>
        </div>
      )}
    </div>
  );
}
