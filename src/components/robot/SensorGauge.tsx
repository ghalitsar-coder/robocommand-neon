interface SensorGaugeProps {
  distance: number;
  max?: number;
}

export function SensorGauge({ distance, max = 100 }: SensorGaugeProps) {
  const clamped = Math.max(0, Math.min(max, distance));
  const pct = clamped / max;
  const proximity = 1 - pct;

  const tone =
    proximity > 0.7
      ? "var(--destructive)"
      : proximity > 0.4
      ? "var(--warning)"
      : "var(--navy)";

  // semicircle gauge geometry
  const size = 200;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circ = Math.PI * r; // half circumference
  const dash = proximity * circ;

  return (
    <div className="space-y-5">
      <div className="flex items-baseline justify-between">
        <span className="label-eyebrow">Ball Proximity</span>
        <span className="font-mono text-[10px] text-muted-foreground tracking-wider">
          HC-SR04 · 0–{max}cm
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative shrink-0" style={{ width: size, height: size / 2 + 8 }}>
          <svg width={size} height={size / 2 + 8} viewBox={`0 0 ${size} ${size / 2 + 8}`}>
            {/* track */}
            <path
              d={`M ${stroke / 2} ${cy} A ${r} ${r} 0 0 1 ${size - stroke / 2} ${cy}`}
              fill="none"
              stroke="var(--border)"
              strokeWidth={stroke}
              strokeLinecap="round"
            />
            {/* value */}
            <path
              d={`M ${stroke / 2} ${cy} A ${r} ${r} 0 0 1 ${size - stroke / 2} ${cy}`}
              fill="none"
              stroke={tone}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circ}`}
              style={{ transition: "stroke-dasharray 400ms ease, stroke 300ms ease" }}
            />
          </svg>
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
            <span className="text-3xl font-semibold tabular-nums text-foreground">
              {clamped.toFixed(0)}
              <span className="text-sm font-normal text-muted-foreground ml-1">cm</span>
            </span>
            <span className="label-eyebrow mt-1" style={{ color: tone }}>
              {proximity > 0.7 ? "Contact" : proximity > 0.4 ? "Near" : "Clear"}
            </span>
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-3 flex-1 text-sm">
          <Stat label="Status" value={proximity > 0.7 ? "Ball detected" : proximity > 0.4 ? "Approaching" : "No object"} />
          <Stat label="Signal" value={`${(proximity * 100).toFixed(0)}%`} />
          <Stat label="Threshold" value="< 12 cm" />
        </dl>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0">
      <dt className="label-eyebrow">{label}</dt>
      <dd className="font-medium text-foreground text-sm tabular-nums">{value}</dd>
    </div>
  );
}
