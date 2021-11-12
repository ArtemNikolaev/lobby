const WebSocket = require("ws");
const chatService = require("./chatService");
const { chatMessageEvent, chatHistoryEvent } = require("../../config").wsEvents;
const eventService = require("./eventService");

module.exports = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("listening", () => {
    console.log("WebSocketServer started");
  });

  wss.on("connection", (ws) => {
    ws.on("message", async (data) => {
      const message = JSON.parse(data);
      console.log(message.event, message);

      switch (message.event) {
        case chatMessageEvent:
          await chatService.saveMessage(message);
          const chat = await chatService.getChatHistory(message);

          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  event: chatMessageEvent,
                  id: message.id,
                  chatData: chat,
                })
              );
            }
          });
          break;

        case chatHistoryEvent:
          const chatData = await chatService.getChatHistory(message);
          if (!chatData) return;

          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  event: chatHistoryEvent,
                  id: message.id,
                  chatData,
                })
              );
            }
          });
          break;

        case "createTable":
          await eventService.createTable(wss, message);
          break;

        case "deleteTable":
          await eventService.deleteTable(wss, message);
          break;

        case "userJoinTable":
          await eventService.userJoinTable(wss, message);
          break;

        case "userLeftTable":
          await eventService.userLeftTable(wss, message);
          break;

        case "getPlayersCount":
          await eventService.getPlayersCount(ws, message);
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
