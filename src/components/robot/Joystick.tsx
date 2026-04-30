import { useCallback, useEffect, useRef, useState } from "react";

export interface JoystickVector {
  x: number; // -1..1
  y: number; // -1..1
  magnitude: number; // 0..1
  angle: number; // degrees
}

interface JoystickProps {
  size?: number;
  onChange?: (v: JoystickVector) => void;
}

export function Joystick({ size = 240, onChange }: JoystickProps) {
  const baseRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const radius = size / 2;
  const knobSize = size * 0.36;

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
        className="relative rounded-full touch-none"
        style={{
          width: size,
          height: size,
          background:
            "radial-gradient(circle at center, oklch(0.25 0.05 230 / 0.9), oklch(0.16 0.03 240 / 0.9))",
          boxShadow:
            "inset 0 0 40px oklch(0.85 0.18 210 / 0.25), 0 0 30px oklch(0.85 0.18 210 / 0.3)",
          border: "1px solid oklch(0.85 0.18 210 / 0.5)",
        }}
      >
        {/* concentric rings */}
        <div className="absolute inset-4 rounded-full border border-neon-cyan/20" />
        <div className="absolute inset-10 rounded-full border border-neon-cyan/15" />
        {/* crosshairs */}
        <div className="absolute left-1/2 top-2 bottom-2 w-px bg-neon-cyan/20 -translate-x-1/2" />
        <div className="absolute top-1/2 left-2 right-2 h-px bg-neon-cyan/20 -translate-y-1/2" />

        {/* knob */}
        <div
          className="absolute rounded-full transition-[box-shadow] duration-150"
          style={{
            width: knobSize,
            height: knobSize,
            left: `calc(50% - ${knobSize / 2}px)`,
            top: `calc(50% - ${knobSize / 2}px)`,
            transform: `translate(${pos.x}px, ${pos.y}px)`,
            background:
              "radial-gradient(circle at 30% 30%, oklch(0.95 0.1 200), oklch(0.55 0.18 220))",
            boxShadow: active
              ? "0 0 30px oklch(0.85 0.18 210 / 0.9), 0 0 60px oklch(0.85 0.18 210 / 0.5)"
              : "0 0 16px oklch(0.85 0.18 210 / 0.5)",
            border: "1px solid oklch(0.95 0.1 200 / 0.7)",
          }}
        >
          <div className="absolute inset-2 rounded-full border border-background/40" />
        </div>
      </div>
      <div className="font-mono text-xs text-muted-foreground tracking-widest">
        VEC&nbsp;{(mag * 100).toFixed(0).padStart(3, "0")}%
      </div>
    </div>
  );
}
