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
  const radius = 96;
  return (
    <div className="relative w-[240px] h-[240px] mx-auto">
      {/* center hub */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-neon-cyan/40 bg-surface/60 flex items-center justify-center">
        <span className="font-mono text-[10px] text-neon-cyan tracking-widest">IDLE</span>
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
              "absolute w-14 h-14 rounded-xl border flex flex-col items-center justify-center font-display text-2xl transition-all touch-none clip-corner",
              "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
              isActive
                ? "bg-gradient-cyan text-primary-foreground border-neon-cyan shadow-neon-cyan scale-110"
                : "bg-surface/80 border-neon-cyan/30 text-neon-cyan hover:border-neon-cyan/70 hover:bg-surface-elevated active:scale-95",
            )}
            style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
          >
            <span className="leading-none">{label}</span>
            <span className="text-[9px] font-mono opacity-70 mt-0.5 tracking-wider">{key}</span>
          </button>
        );
      })}
    </div>
  );
}
