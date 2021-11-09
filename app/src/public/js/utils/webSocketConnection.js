import app from "../config.js";

export default () => {
  const ws = new WebSocket(app.wsUrl);
  ws.onopen = () => console.log("WS: Ready to listen Events");
  ws.onclose = () => console.log("WS: Connection closed...");
  ws.onerror = (error) => showError(error);

  return ws;
};
