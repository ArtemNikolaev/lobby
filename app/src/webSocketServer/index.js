const WebSocket = require("ws");
const wsStorage = require("./wsStorage");

module.exports = (server) => {
  const wss = new WebSocket.Server({ server });
  wss.on("listening", () => {
    console.log("WebSocketServer started");
  });

  wss.on("connection", (ws) => {
    ws.on("message", async (data) => {
      const message = JSON.parse(data);

      switch (message.event) {
        case "chat":
          await wsStorage.save(message);
          const chat = await wsStorage.getChatById(message.id);

          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  event: "chat",
                  id: message.id,
                  chatData: chat,
                })
              );
            }
          });
          break;

        case "getChat":
          const chatData = await wsStorage.getChatById(message.id);
          if (!chatData) return;

          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  event: "getChat",
                  id: message.id,
                  chatData,
                })
              );
            }
          });
          break;

        default:
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(message));
            }
          });
          break;
      }
    });
  });
};
