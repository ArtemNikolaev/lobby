const WebSocket = require("ws");
const {
  chatMessageEvent,
  chatHistoryEvent,
  createTableEvent,
  deleteTableEvent,
  userJoinTableEvent,
  userLeftTableEvent,
  getPlayersCountEvent,
} = require("../../config").wsEvents;
const eventController = require("./eventController");

module.exports = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("listening", () => {
    global.console.log("WebSocketServer started");
  });

  wss.on("connection", (ws) => {
    ws.on("message", async (data) => {
      const message = JSON.parse(data);

      switch (message.event) {
        case chatMessageEvent:
          await eventController.saveChatMessage(wss, message);
          break;

        case chatHistoryEvent:
          await eventController.getChatHistory(ws, message);
          break;

        case createTableEvent:
          await eventController.createTable(wss, message);
          break;

        case deleteTableEvent:
          await eventController.deleteTable(wss, message);
          break;

        case userJoinTableEvent:
          await eventController.userJoinTable(wss, message);
          break;

        case userLeftTableEvent:
          await eventController.userLeftTable(wss, message);
          break;

        case getPlayersCountEvent:
          await eventController.getPlayersViewersCount(ws, message);
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

    ws.on("close", () => global.console.log("WS connection CLOSED!"));
  });
};
