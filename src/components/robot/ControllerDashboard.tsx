import { useEffect, useMemo, useState } from "react";
import { CyberCard } from "./CyberCard";
import { Joystick, JoystickVector } from "./Joystick";
import { DPad, Direction } from "./DPad";
import { StatusPill } from "./StatusPill";
import { SensorGauge } from "./SensorGauge";
import { BatteryIndicator } from "./BatteryIndicator";
import { cn } from "@/lib/utils";
import { Zap, Lock, Shield, Wifi, WifiOff } from "lucide-react";

type ControlMode = "joystick" | "dpad";

export function ControllerDashboard() {
  const [mode, setMode] = useState<ControlMode>("joystick");
  const [vector, setVector] = useState<JoystickVector>({ x: 0, y: 0, magnitude: 0, angle: 0 });
  const [dpadDir, setDpadDir] = useState<Direction | null>(null);

  const [dribbling, setDribbling] = useState(false);
  const [kicking, setKicking] = useState(false);

  const [distance, setDistance] = useState(64);
  const [battery, setBattery] = useState(82);
  const [connected, setConnected] = useState(true);
  const [latency, setLatency] = useState(18);

  useEffect(() => {
    const id = setInterval(() => {
      setDistance((d) => Math.max(4, Math.min(100, d + (Math.random() - 0.5) * 12)));
      setBattery((b) => Math.max(0, b - 0.02));
      setLatency(12 + Math.round(Math.random() * 30));
    }, 900);
    return () => clearInterval(id);
  }, []);

  const kickSafe = !dribbling;

  const handleKick = () => {
    if (!kickSafe) return;
    setKicking(true);
    setTimeout(() => setKicking(false), 350);
  };

  const ballNear = distance < 12;

  const movementLabel = useMemo(() => {
    if (mode === "dpad") return dpadDir ?? "—";
    if (vector.magnitude < 0.05) return "—";
    const dirs = ["E", "NE", "N", "NW", "W", "SW", "S", "SE"];
    const idx = Math.round(((vector.angle + 360) % 360) / 45) % 8;
    return dirs[idx];
  }, [mode, dpadDir, vector]);

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-md bg-navy flex items-center justify-center text-primary-foreground font-semibold text-sm tracking-wide">
              R3
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                Omni Robot Controller
              </h1>
              <p className="label-eyebrow mt-0.5">
                Unit · OMNI-3 · ws://192.168.4.1:81
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill
              label={connected ? `Online · ${latency}ms` : "Offline"}
              tone={connected ? "ok" : "danger"}
              pulse={connected}
            />
            <StatusPill
              label={`Battery ${battery.toFixed(0)}%`}
              tone={battery > 50 ? "ok" : battery > 20 ? "warn" : "danger"}
            />
            <StatusPill
              label={ballNear ? "Ball detected" : "Scanning"}
              tone={ballNear ? "warn" : "idle"}
              pulse={ballNear}
            />
          </div>
        </header>

        <div className="grid gap-5 lg:gap-6 grid-cols-1 lg:grid-cols-12">
          {/* Drive Control */}
          <CyberCard
            eyebrow="01 · Navigation"
            title="Drive Control"
            className="lg:col-span-7"
            status={
              <div className="inline-flex bg-surface-muted rounded-md p-0.5 border border-border">
                {(["joystick", "dpad"] as ControlMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={cn(
                      "px-3 py-1 rounded text-xs font-medium capitalize transition",
                      mode === m
                        ? "bg-surface text-navy shadow-card"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            }
          >
            <div className="grid sm:grid-cols-[1fr_auto] gap-8 items-center">
              <div className="flex justify-center py-2">
                {mode === "joystick" ? (
                  <Joystick onChange={setVector} />
                ) : (
                  <DPad
                    active={dpadDir}
                    onPress={(d) => setDpadDir(d)}
                    onRelease={() => setDpadDir(null)}
                  />
                )}
              </div>

              <dl className="grid grid-cols-2 sm:grid-cols-1 gap-2 text-sm min-w-[180px]">
                <Readout label="Direction" value={movementLabel} accent />
                <Readout label="Vx" value={(mode === "joystick" ? vector.x : 0).toFixed(2)} />
                <Readout label="Vy" value={(mode === "joystick" ? vector.y : 0).toFixed(2)} />
                <Readout
                  label="Throttle"
                  value={`${(mode === "joystick" ? vector.magnitude * 100 : dpadDir ? 100 : 0).toFixed(0)}%`}
                />
                <Readout label="Heading" value={`${mode === "joystick" ? vector.angle.toFixed(0) : 0}°`} />
              </dl>
            </div>
          </CyberCard>

          {/* Actuators */}
          <CyberCard eyebrow="02 · Actuators" title="Manipulation" className="lg:col-span-5">
            <div className="space-y-4">
              {/* Dribbler */}
              <button
                onClick={() => setDribbling((d) => !d)}
                className="w-full text-left rounded-md border border-border bg-surface hover:border-navy/40 p-4 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="label-eyebrow">Servo</div>
                    <div className="text-base font-semibold text-foreground mt-0.5">Dribbler</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {dribbling ? "Engaged — holding ball" : "Open — ready to release"}
                    </div>
                  </div>
                  {/* Sleek toggle */}
                  <div
                    className={cn(
                      "relative h-7 w-12 rounded-full transition-colors shrink-0",
                      dribbling ? "bg-navy" : "bg-border",
                    )}
                  >
                    <div
                      className={cn(
                        "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-card transition-transform",
                        dribbling ? "translate-x-[22px]" : "translate-x-0.5",
                      )}
                    />
                  </div>
                </div>
              </button>

              {/* KICK */}
              <button
                onClick={handleKick}
                disabled={!kickSafe}
                className={cn(
                  "relative w-full rounded-md p-5 transition-all overflow-hidden border",
                  kickSafe
                    ? "bg-navy border-navy text-primary-foreground hover:opacity-95 active:scale-[0.99]"
                    : "bg-surface-muted border-border text-muted-foreground cursor-not-allowed",
                  kicking && "scale-[0.98]",
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="text-xs font-mono uppercase tracking-[0.18em] opacity-80">
                      Solenoid
                    </div>
                    <div className="text-2xl font-semibold tracking-tight mt-1">
                      {kicking ? "Firing…" : "Kick"}
                    </div>
                    <div className="text-xs mt-1.5 opacity-80 flex items-center gap-1.5">
                      {kickSafe ? (
                        <>
                          <Shield className="h-3 w-3" />
                          Armed — interlock cleared
                        </>
                      ) : (
                        <>
                          <Lock className="h-3 w-3" />
                          Disabled — open dribbler first
                        </>
                      )}
                    </div>
                  </div>
                  <div
                    className={cn(
                      "h-12 w-12 rounded-full flex items-center justify-center border",
                      kickSafe ? "border-white/25 bg-white/10" : "border-border bg-surface",
                    )}
                  >
                    {kickSafe ? <Zap className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                  </div>
                </div>
              </button>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    kickSafe ? "bg-[color:var(--success)]" : "bg-destructive",
                  )}
                />
                Safety interlock: kick requires dribbler open
              </div>
            </div>
          </CyberCard>

          {/* Sensor */}
          <CyberCard eyebrow="03 · Telemetry" title="Ultrasonic Sensor" className="lg:col-span-7">
            <SensorGauge distance={distance} />
          </CyberCard>

          {/* Power & Link */}
          <CyberCard eyebrow="04 · System" title="Power & Link" className="lg:col-span-5">
            <div className="space-y-5">
              <BatteryIndicator level={battery} voltage={6.8 + (battery / 100) * 1.6} />

              <div className="border-t border-border pt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="label-eyebrow">WebSocket Link</span>
                  <button
                    onClick={() => setConnected((c) => !c)}
                    className={cn(
                      "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded border transition-colors",
                      connected
                        ? "border-border text-[color:var(--success)] hover:bg-surface-muted"
                        : "border-border text-destructive hover:bg-surface-muted",
                    )}
                  >
                    {connected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                    {connected ? "Connected" : "Disconnected"}
                  </button>
                </div>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <Readout label="Latency" value={`${latency} ms`} />
                  <Readout label="RSSI" value="-54 dB" />
                  <Readout label="Host" value="esp32-r3" />
                  <Readout label="Channel" value="6" />
                </dl>
              </div>
            </div>
          </CyberCard>
        </div>

        <footer className="mt-10 pt-5 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-mono tracking-wider">SYS · OMNI3 · v0.1.0</span>
          <span className="font-mono tracking-wider">Control loop · 50 Hz</span>
        </footer>
      </div>
    </div>
  );
}

function Readout({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between bg-surface-muted border border-border rounded px-3 py-2">
      <span className="label-eyebrow">{label}</span>
      <span
        className={cn(
          "tabular-nums text-sm font-medium",
          accent ? "text-navy font-semibold" : "text-foreground",
        )}
      >
        {value}
      </span>
    </div>
  );
}
