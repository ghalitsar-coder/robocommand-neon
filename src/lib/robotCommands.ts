import type { Direction } from "@/components/robot/DPad";

export const ROBOT_MOVE_TOPIC = import.meta.env.VITE_ROBOT_MOVE_TOPIC ?? "robot/gerak";

export type RobotMoveCommand =
  | "maju"
  | "mundur"
  | "geserKanan"
  | "geserKiri"
  | "serongKiriDepan"
  | "serongKananDepan"
  | "serongKiriBelakang"
  | "serongKananBelakang"
  | "putarKanan"
  | "putarKiri"
  | "berhenti";

export const directionCommandMap: Record<Direction, RobotMoveCommand> = {
  N: "maju",
  NE: "serongKananDepan",
  E: "geserKanan",
  SE: "serongKananBelakang",
  S: "mundur",
  SW: "serongKiriBelakang",
  W: "geserKiri",
  NW: "serongKiriDepan",
};

// Baru: mapping dari command Bahasa ke vector (vx, vy)
export const commandToVector: Record<RobotMoveCommand, { vx: number; vy: number }> = {
  // Firmware: vy positif = mundur (South), vy negatif = maju (North)
  maju:             { vx: 0,    vy: -1 },
  mundur:           { vx: 0,    vy: 1 },
  geserKanan:       { vx: 1,    vy: 0 },
  geserKiri:        { vx: -1,   vy: 0 },
  serongKananDepan:  { vx: 0.5,  vy: -0.5 },
  serongKiriDepan:   { vx: -0.5, vy: -0.5 },
  serongKananBelakang:{ vx: 0.5, vy: 0.5 },
  serongKiriBelakang: { vx: -0.5,vy: 0.5 },
  putarKanan:        { vx: 0.5,  vy: 0 },
  putarKiri:         { vx: -0.5, vy: 0 },
  berhenti:          { vx: 0,    vy: 0 },
};

// Baru: Function untuk mengkonversi command ke format CSV yang diterima ESP32
export function commandToCsv(command: RobotMoveCommand): string {
  const { vx, vy } = commandToVector[command];
  return `${vx.toFixed(2)},${vy.toFixed(2)}`;
}

export function directionToCommand(direction: Direction): RobotMoveCommand {
  return directionCommandMap[direction];
}

// Baru: versi yang sudah format CSV langsung untuk ESP32
export function directionToCsv(direction: Direction): string {
  return commandToCsv(directionCommandMap[direction]);
}

export function vectorToCommand(angle: number, magnitude: number): RobotMoveCommand {
  if (magnitude < 0.05) return "berhenti";

  const directions: Direction[] = ["E", "NE", "N", "NW", "W", "SW", "S", "SE"];
  const index = Math.round(((angle + 360) % 360) / 45) % directions.length;

  return directionToCommand(directions[index]);
}

// Baru: versi vector langsung ke CSV
export function vectorToCsv(angle: number, magnitude: number): string {
  if (magnitude < 0.05) return "0.00,0.00";

  const rad = (angle * Math.PI) / 180;
  const vx = Math.cos(rad) * magnitude;
  const vy = Math.sin(rad) * magnitude;

  return `${vx.toFixed(2)},${vy.toFixed(2)}`;
}

export function rotateCommand(direction: "left" | "right"): RobotMoveCommand {
  return direction === "right" ? "putarKanan" : "putarKiri";
}

// Baru: rotate langsung ke CSV
export function rotateToCsv(direction: "left" | "right"): string {
  const cmd = rotateCommand(direction);
  return commandToCsv(cmd);
}
