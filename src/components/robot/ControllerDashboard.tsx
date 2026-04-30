import { useEffect, useMemo, useState } from "react";
import { CyberCard } from "./CyberCard";
import { Joystick, JoystickVector } from "./Joystick";
import { DPad, Direction } from "./DPad";
import { StatusPill } from "./StatusPill";
import { SensorGauge } from "./SensorGauge";
import { BatteryIndicator } from "./BatteryIndicator";
import { cn } from "@/lib/utils";

type ControlMode = "joystick" | "dpad";

export function ControllerDashboard() {
  const [mode, setMode] = useState<ControlMode>("joystick");
  const [vector, setVector] = useState<JoystickVector>({ x: 0, y: 0, magnitude: 0, angle: 0 });
  const [dpadDir, setDpadDir] = useState<Direction | null>(null);

  const [dribbling, setDribbling] = useState(false);
  const [kicking, setKicking] = useState(false);

  // simulated telemetry
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

  // KICK is only safe to fire when dribbler is OPEN (not dribbling = ball released)
  const kickSafe = !dribbling;

  const handleKick = () => {
    if (!kickSafe) return;
    setKicking(true);
    setTimeout(() => setKicking(false), 350);
    // TODO: send WS command { cmd: "kick" }
  };

  const ballNear = distance < 12;

  const headerStatus = (
    <div className="flex flex-wrap items-center gap-2">
      <StatusPill label={connected ? `LINK ${latency}ms` : "OFFLINE"} tone={connected ? "ok" : "danger"} pulse={connected} />
      <StatusPill label={`BAT ${battery.toFixed(0)}%`} tone={battery > 50 ? "ok" : battery > 20 ? "warn" : "danger"} />
      <StatusPill label={ballNear ? "BALL LOCK" : "SCAN"} tone={ballNear ? "warn" : "idle"} pulse={ballNear} />
    </div>
  );

  const movementLabel = useMemo(() => {
    if (mode === "dpad") return dpadDir ?? "—";
    if (vector.magnitude < 0.05) return "—";
    const dirs = ["E", "NE", "N", "NW", "W", "SW", "S", "SE"];
    const idx = Math.round(((vector.angle + 360) % 360) / 45) % 8;
    return dirs[idx];
  }, [mode, dpadDir, vector]);

  return (
    <div className="relative min-h-screen w-full px-4 py-5 sm:px-6 sm:py-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-11 rounded-lg bg-gradient-cyan flex items-center justify-center font-display text-xl text-primary-foreground shadow-neon-cyan">
            R3
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl tracking-widest text-glow-cyan text-neon-cyan">
              OMNI&nbsp;CONTROL
            </h1>
            <p className="font-mono text-[10px] text-muted-foreground tracking-widest">
              3-WHEEL OMNI · ESP32 · WS://192.168.4.1:81
            </p>
          </div>
        </div>
        {headerStatus}
      </header>

      <div className="grid gap-4 lg:gap-6 grid-cols-1 lg:grid-cols-12">
        {/* Movement card */}
        <CyberCard
          title="Drive Control"
          accent="cyan"
          className="lg:col-span-7"
          status={
            <div className="flex gap-1 bg-background/60 rounded-md p-0.5 border border-border/60">
              {(["joystick", "dpad"] as ControlMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    "px-2.5 py-1 rounded-sm font-mono text-[10px] uppercase tracking-widest transition",
                    mode === m
                      ? "bg-neon-cyan text-primary-foreground shadow-neon-cyan"
                      : "text-muted-foreground hover:text-neon-cyan",
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          }
        >
          <div className="grid sm:grid-cols-[1fr_auto] gap-6 items-center">
            <div className="flex justify-center py-4">
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

            {/* telemetry readout */}
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 font-mono text-xs min-w-[180px]">
              <Readout label="DIR" value={movementLabel} accent />
              <Readout label="VX" value={(mode === "joystick" ? vector.x : 0).toFixed(2)} />
              <Readout label="VY" value={(mode === "joystick" ? vector.y : 0).toFixed(2)} />
              <Readout
                label="THR"
                value={`${(mode === "joystick" ? vector.magnitude * 100 : dpadDir ? 100 : 0).toFixed(0)}%`}
              />
              <Readout label="HDG" value={`${mode === "joystick" ? vector.angle.toFixed(0) : 0}°`} />
            </div>
          </div>
        </CyberCard>

        {/* Action buttons */}
        <CyberCard title="Actuators" accent="magenta" className="lg:col-span-5">
          <div className="grid gap-4">
            {/* Dribbler toggle */}
            <button
              onClick={() => setDribbling((d) => !d)}
              className={cn(
                "group relative w-full rounded-lg border-2 px-4 py-5 transition-all clip-corner overflow-hidden",
                dribbling
                  ? "bg-gradient-green border-neon-green shadow-neon-green"
                  : "bg-surface/80 border-neon-green/40 hover:border-neon-green",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div
                    className={cn(
                      "font-display text-lg tracking-widest",
                      dribbling ? "text-background" : "text-neon-green text-glow-green",
                    )}
                  >
                    DRIBBLER
                  </div>
                  <div
                    className={cn(
                      "font-mono text-[10px] uppercase tracking-widest mt-1",
                      dribbling ? "text-background/80" : "text-muted-foreground",
                    )}
                  >
                    {dribbling ? "● ENGAGED · BALL HELD" : "○ OPEN · READY TO RELEASE"}
                  </div>
                </div>
                <div
                  className={cn(
                    "h-12 w-12 rounded-full border-2 flex items-center justify-center font-display",
                    dribbling
                      ? "bg-background/30 border-background text-background"
                      : "border-neon-green/60 text-neon-green",
                  )}
                >
                  {dribbling ? "ON" : "OFF"}
                </div>
              </div>
            </button>

            {/* KICK button */}
            <button
              onClick={handleKick}
              disabled={!kickSafe}
              className={cn(
                "relative w-full rounded-lg border-2 px-4 py-7 transition-all overflow-hidden clip-corner select-none",
                kickSafe
                  ? "bg-gradient-danger border-neon-magenta text-background animate-pulse-glow active:scale-[0.98]"
                  : "bg-muted/40 border-border text-muted-foreground cursor-not-allowed",
                kicking && "scale-95",
              )}
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="text-left">
                  <div className="font-display text-3xl sm:text-4xl tracking-[0.3em]">
                    {kicking ? "FIRE!" : "KICK"}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-widest mt-1 opacity-80">
                    {kickSafe ? "● SAFETY OFF · SOLENOID ARMED" : "⚠ DISABLED · OPEN DRIBBLER FIRST"}
                  </div>
                </div>
                <div className="font-display text-3xl">
                  {kickSafe ? "⚡" : "🔒"}
                </div>
              </div>
              {kickSafe && (
                <div
                  className="absolute inset-x-0 top-0 h-px animate-scan"
                  style={{ background: "linear-gradient(90deg, transparent, white, transparent)" }}
                />
              )}
            </button>

            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              <span className={cn("h-1.5 w-1.5 rounded-full", kickSafe ? "bg-neon-green" : "bg-destructive")} />
              Interlock: Kick requires dribbler in OPEN state
            </div>
          </div>
        </CyberCard>

        {/* Sensor */}
        <CyberCard title="Ultrasonic Sensor" accent="amber" className="lg:col-span-7">
          <SensorGauge distance={distance} />
        </CyberCard>

        {/* Battery & link */}
        <CyberCard title="Power & Link" accent="green" className="lg:col-span-5">
          <div className="space-y-5">
            <BatteryIndicator level={battery} voltage={6.8 + (battery / 100) * 1.6} />
            <div className="border-t border-border/60 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  WebSocket
                </span>
                <button
                  onClick={() => setConnected((c) => !c)}
                  className={cn(
                    "font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded border",
                    connected
                      ? "border-neon-green/50 text-neon-green"
                      : "border-destructive/60 text-destructive",
                  )}
                >
                  {connected ? "● CONNECTED" : "○ DISCONNECTED"}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                <Readout label="LAT" value={`${latency}ms`} />
                <Readout label="RSSI" value="-54dB" />
                <Readout label="HOST" value="esp32-r3" />
                <Readout label="CH" value="6" />
              </div>
            </div>
          </div>
        </CyberCard>
      </div>

      <footer className="mt-8 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        <span>SYS · OMNI3 · v0.1.0</span>
        <span className="text-neon-cyan/70">// MAIN.LOOP @ 50Hz</span>
      </footer>
    </div>
  );
}

function Readout({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between bg-background/60 border border-border/60 rounded px-2.5 py-1.5">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={cn(
          "tabular-nums font-display tracking-widest",
          accent ? "text-neon-cyan text-glow-cyan" : "text-foreground",
        )}
      >
        {value}
      </span>
    </div>
  );
}
