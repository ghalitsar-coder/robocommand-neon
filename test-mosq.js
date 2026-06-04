import mqtt from "mqtt";

const wssUrl = "wss://test.mosquitto.org:8081/mqtt";
const wsUrl = "ws://test.mosquitto.org:8080/mqtt";

console.log("Testing:", wssUrl);
const clientWss = mqtt.connect(wssUrl, { connectTimeout: 3000 });
clientWss.on("connect", () => {
  console.log("WSS Connected!");
  clientWss.end();
});
clientWss.on("error", (err) => {
  console.error("WSS Error:", err.message);
});

console.log("Testing:", wsUrl);
const clientWs = mqtt.connect(wsUrl, { connectTimeout: 3000 });
clientWs.on("connect", () => {
  console.log("WS Connected!");
  clientWs.end();
});
clientWs.on("error", (err) => {
  console.error("WS Error:", err.message);
});
