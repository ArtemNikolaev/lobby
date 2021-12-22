import { webSocket } from "../config.js";

export default () =>
  new Promise((resolve, reject) => {
    const ws = new WebSocket(webSocket.url);

    ws.onopen = () => {
      window.console.log("WS: Ready to listen Events");
      resolve(ws);
    };

    ws.onerror = (error) => reject(error);

    ws.onclose = () => window.console.log("WS: Connection closed...");
  });
