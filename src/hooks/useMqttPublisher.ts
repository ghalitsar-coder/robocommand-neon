import mqtt, { MqttClient, IClientOptions } from "mqtt";
import { useCallback, useEffect, useRef, useState } from "react";

const MQTT_URL =
  import.meta.env.VITE_MQTT_URL ?? "wss://broker.hivemq.com:8884/mqtt";
const MQTT_USERNAME = import.meta.env.VITE_MQTT_USERNAME ?? "";
const MQTT_PASSWORD = import.meta.env.VITE_MQTT_PASSWORD ?? "";

export type MqttStatus = "connecting" | "connected" | "offline" | "error";

interface UseMqttPublisherOptions {
  url?: string;
  clientIdPrefix?: string;
}

export function useMqttPublisher({
  url = MQTT_URL,
  clientIdPrefix = "robocommand-neon",
}: UseMqttPublisherOptions = {}) {
  const clientRef = useRef<MqttClient | null>(null);
  const [status, setStatus] = useState<MqttStatus>("connecting");
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    // Buat clientId sekali saja per mount
    const clientId = `${clientIdPrefix}-${Math.random().toString(16).slice(2)}`;

    const clientOptions: IClientOptions = {
      clientId,
      clean: true,
      connectTimeout: 10000,
      reconnectPeriod: 5000,
      keepalive: 60,
      // Hanya tambahkan auth jika ada isinya
      ...(MQTT_USERNAME ? { username: MQTT_USERNAME } : {}),
      ...(MQTT_PASSWORD ? { password: MQTT_PASSWORD } : {}),
    };

    console.log("[MQTT] Connecting to:", url);
    console.log("[MQTT] Client ID:", clientId);
    if (MQTT_USERNAME) console.log("[MQTT] Username:", MQTT_USERNAME);

    const client = mqtt.connect(url, clientOptions);
    clientRef.current = client;
    setStatus("connecting");
    setLastError(null);

    client.on("connect", () => {
      console.log("[MQTT] Connected successfully!");
      setStatus("connected");
      setLastError(null);
    });

    client.on("reconnect", () => {
      console.log("[MQTT] Reconnecting...");
      setStatus("connecting");
    });

    client.on("offline", () => {
      console.log("[MQTT] Offline");
      setStatus("offline");
    });

    client.on("close", () => {
      console.log("[MQTT] Connection closed");
      setStatus("offline");
    });

    client.on("error", (error) => {
      console.error("[MQTT] Error:", error.message);
      setStatus("error");
      setLastError(error.message);
    });

    client.on("disconnect", () => {
      console.log("[MQTT] Disconnected by broker");
      setStatus("offline");
    });

    return () => {
      console.log("[MQTT] Cleanup: ending client");
      clientRef.current = null;
      client.end(true);
    };
  }, [url, clientIdPrefix]);

  const publish = useCallback((topic: string, payload: string) => {
    const client = clientRef.current;
    if (!client || !client.connected) {
      console.warn("[MQTT] Cannot publish: not connected");
      return false;
    }
    client.publish(topic, payload, { qos: 0, retain: false });
    return true;
  }, []);

  return {
    status,
    connected: status === "connected",
    lastError,
    publish,
    url,
  };
}
