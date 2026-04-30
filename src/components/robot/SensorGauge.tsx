interface SensorGaugeProps {
  /** distance in cm, 0..max */
  distance: number;
  max?: number;
}

export function SensorGauge({ distance, max = 100 }: SensorGaugeProps) {
  const clamped = Math.max(0, Math.min(max, distance));
  const pct = clamped / max;
  // closer = hotter
  const proximity = 1 - pct;
  const tone =
    proximity > 0.7 ? "magenta" : proximity > 0.4 ? "amber" : "cyan";

  const toneColor = {
    cyan: "var(--neon-cyan)",
    amber: "var(--neon-amber)",
    magenta: "var(--neon-magenta)",
  }[tone];

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Ball Proximity
        </span>
        <span
          className="font-display text-3xl tabular-nums"
          style={{ color: toneColor, textShadow: `0 0 14px ${toneColor}` }}
        >
          {clamped.toFixed(0)}
          <span className="text-xs ml-1 opacity-70">cm</span>
        </span>
      </div>

      {/* radar-like arcs */}
      <div className="relative h-24 overflow-hidden rounded-lg bg-background/60 border border-border/60">
        <div
          className="absolute inset-x-0 bottom-0 h-px animate-scan"
          style={{ background: `linear-gradient(90deg, transparent, ${toneColor}, transparent)` }}
        />
        {[0.25, 0.5, 0.75, 1].map((r) => (
          <div
            key={r}
            className="absolute left-1/2 bottom-0 rounded-full border"
            style={{
              width: `${r * 200}%`,
              height: `${r * 200}%`,
              transform: "translateX(-50%)",
              borderColor: `color-mix(in oklab, ${toneColor} ${(1 - r) * 80}%, transparent)`,
            }}
          />
        ))}
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-full"
          style={{
            bottom: `${(proximity * 70)}%`,
            width: 14,
            height: 14,
            background: toneColor,
            boxShadow: `0 0 18px ${toneColor}, 0 0 36px ${toneColor}`,
          }}
        />
      </div>

      {/* segmented bar */}
      <div className="flex gap-1">
        {Array.from({ length: 20 }).map((_, i) => {
          const active = i < Math.round(proximity * 20);
          return (
            <div
              key={i}
              className="flex-1 h-2 rounded-sm transition-all"
              style={{
                background: active ? toneColor : "oklch(0.25 0.03 240)",
                boxShadow: active ? `0 0 8px ${toneColor}` : "none",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
