import app from "../config.js";

export default () => {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(app.wsUrl);
    ws.onopen = () => {
      console.log("WS: Ready to listen Events");
      resolve(ws);
    };
    ws.onerror = (error) => {
      reject(error);
    };
    ws.onclose = () => console.log("WS: Connection closed...");
  });
};
