const WebSocket = require("ws");
const lobbyChatStorage = require("./lobbyChatStorage");

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
          await lobbyChatStorage.save(message);
          const chat = await lobbyChatStorage.getChatById(message.id);

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
          const chatData = await lobbyChatStorage.getChatById(message.id);
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
