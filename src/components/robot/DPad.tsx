import { cn } from "@/lib/utils";

export type Direction = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";

const dirs: { key: Direction; angle: number; label: string }[] = [
  { key: "N", angle: 0, label: "↑" },
  { key: "NE", angle: 45, label: "↗" },
  { key: "E", angle: 90, label: "→" },
  { key: "SE", angle: 135, label: "↘" },
  { key: "S", angle: 180, label: "↓" },
  { key: "SW", angle: 225, label: "↙" },
  { key: "W", angle: 270, label: "←" },
  { key: "NW", angle: 315, label: "↖" },
];

interface DPadProps {
  active?: Direction | null;
  onPress?: (d: Direction) => void;
  onRelease?: () => void;
}

export function DPad({ active, onPress, onRelease }: DPadProps) {
  const radius = 86;
  return (
    <div className="relative w-[220px] h-[220px] mx-auto">
      <div className="absolute inset-0 rounded-full bg-surface-muted border border-border" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border border-border bg-surface flex items-center justify-center">
        <span className="font-mono text-[10px] text-muted-foreground tracking-wider">IDLE</span>
      </div>
      {dirs.map(({ key, angle, label }) => {
        const rad = ((angle - 90) * Math.PI) / 180;
        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius;
        const isActive = active === key;
        return (
          <button
            key={key}
            onPointerDown={() => onPress?.(key)}
            onPointerUp={() => onRelease?.()}
            onPointerLeave={() => onRelease?.()}
            className={cn(
              "absolute w-12 h-12 rounded-md border flex flex-col items-center justify-center text-xl transition-all touch-none",
              "left-1/2 top-1/2",
              isActive
                ? "bg-navy text-primary-foreground border-navy shadow-card-md scale-105"
                : "bg-surface border-border text-foreground hover:border-navy/40 hover:text-navy active:scale-95",
            )}
            style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
          >
            <span className="leading-none font-medium">{label}</span>
            <span className="text-[9px] font-mono opacity-70 mt-0.5 tracking-wider">{key}</span>
          </button>
        );
      })}
    </div>
  );
}
