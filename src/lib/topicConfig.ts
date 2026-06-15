const env = (import.meta.env.VITE_ENV ?? "development").toLowerCase();
export const IS_PRODUCTION = env === "production";

export interface TopicSet {
  move: string;
  rotate: string;
  kick: string;
  dribble: string | null;
  sensor: string;
}

export const DEV_TOPICS: TopicSet = {
  move: "robot/drive/vector",
  rotate: "robot/drive/rotate",
  kick: "robot/action/kick",
  dribble: "robot/action/dribble",
  sensor: "robot/status/ultrasonic",
};

export const PROD_TOPICS: TopicSet = {
  move: "robot/gerak/vector",
  rotate: "robot/gerak/rotate",
  kick: "robot/tendang",
  dribble: null,
  sensor: "robot/jarak",
};

export const TOPICS: TopicSet = IS_PRODUCTION ? PROD_TOPICS : DEV_TOPICS;
