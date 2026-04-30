import { createFileRoute } from "@tanstack/react-router";
import { ControllerDashboard } from "@/components/robot/ControllerDashboard";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Omni Control · 3-Wheel Soccer Robot Dashboard" },
      {
        name: "description",
        content:
          "Cyberpunk dark-mode controller for a 3-wheel omnidirectional soccer robot — joystick drive, dribbler toggle, kick solenoid, and live ESP32 WebSocket telemetry.",
      },
    ],
  }),
});

function Index() {
  return <ControllerDashboard />;
}
