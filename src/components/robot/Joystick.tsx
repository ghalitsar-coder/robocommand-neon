import { useCallback, useEffect, useRef, useState } from "react";

export interface JoystickVector {
  x: number;
  y: number;
  magnitude: number;
  angle: number;
}

interface JoystickProps {
  size?: number;
  onChange?: (v: JoystickVector) => void;
}

export function Joystick({ size = 220, onChange }: JoystickProps) {
  const baseRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const radius = size / 2;
  const knobSize = size * 0.32;

  const update = useCallback(
    (clientX: number, clientY: number) => {
      const el = baseRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      let dx = clientX - cx;
      let dy = clientY - cy;
      const dist = Math.hypot(dx, dy);
      const max = radius - knobSize / 2;
      if (dist > max) {
        dx = (dx / dist) * max;
        dy = (dy / dist) * max;
      }
      setPos({ x: dx, y: dy });
      const nx = dx / max;
      const ny = dy / max;
      const mag = Math.min(1, Math.hypot(nx, ny));
      const angle = (Math.atan2(-ny, nx) * 180) / Math.PI;
      onChange?.({ x: nx, y: -ny, magnitude: mag, angle });
    },
    [knobSize, onChange, radius],
  );

  const reset = useCallback(() => {
    setPos({ x: 0, y: 0 });
    setActive(false);
    onChange?.({ x: 0, y: 0, magnitude: 0, angle: 0 });
  }, [onChange]);

  useEffect(() => {
    if (!active) return;
    const move = (e: PointerEvent) => update(e.clientX, e.clientY);
    const up = () => reset();
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [active, reset, update]);

  const mag = Math.min(1, Math.hypot(pos.x, pos.y) / (radius - knobSize / 2));

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      <div
        ref={baseRef}
        onPointerDown={(e) => {
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          setActive(true);
          update(e.clientX, e.clientY);
        }}
        className="relative rounded-full touch-none bg-surface-muted border border-border"
        style={{ width: size, height: size }}
      >
        {/* concentric guides */}
        <div className="absolute inset-5 rounded-full border border-border" />
        <div className="absolute inset-12 rounded-full border border-border/70" />
        {/* crosshairs */}
        <div className="absolute left-1/2 top-3 bottom-3 w-px bg-border -translate-x-1/2" />
        <div className="absolute top-1/2 left-3 right-3 h-px bg-border -translate-y-1/2" />
        {/* center dot */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />

        {/* knob */}
        <div
          className="absolute rounded-full transition-shadow duration-150 bg-navy border border-[color:var(--navy-soft)]"
          style={{
            width: knobSize,
            height: knobSize,
            left: `calc(50% - ${knobSize / 2}px)`,
            top: `calc(50% - ${knobSize / 2}px)`,
            transform: `translate(${pos.x}px, ${pos.y}px)`,
            boxShadow: active
              ? "0 6px 20px oklch(0.32 0.07 255 / 0.35)"
              : "0 2px 8px oklch(0.32 0.07 255 / 0.18)",
          }}
        >
          <div className="absolute inset-2 rounded-full border border-white/15" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-1 w-1 rounded-full bg-white/70" />
        </div>
      </div>
      <div className="font-mono text-[11px] text-muted-foreground tracking-wider tabular-nums">
        VECTOR&nbsp;{(mag * 100).toFixed(0).padStart(3, "0")}%
      </div>
    </div>
  );
}
