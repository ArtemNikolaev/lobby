const WebSocket = require("ws");
const eventController = require("./eventController");

const wss = new WebSocket.Server({ port: parseInt(process.env.WS_PORT) });

connection(wss);

function connection(wss) {
  wss.once("listening", () => {
    global.console.log("WebSocketServer started");
  });

  wss.on("connection", (ws) => {
    ws.on("message", async (data) => {
      const message = JSON.parse(data);
      console.log({ message, data });

      switch (message.event) {
        case "chatMessage":
          await eventController.saveChatMessage(wss, message);
          break;

        case "chatHistory":
          await eventController.getChatHistory(ws, message);
          break;

        case "addGame":
          await eventController.addGame(wss, message);
          break;

        case "deleteGame":
          await eventController.deleteGame(wss, message);
          break;

        case "createTable":
          await eventController.createTable(wss, message);
          break;

        case "deleteTable":
          await eventController.deleteTable(wss, message);
          break;

        case "userJoinTable":
          await eventController.userJoinTable(wss, message);
          break;

        case "userLeftTable":
          await eventController.userLeftTable(wss, message);
          break;

        case "getPlayersCount":
          await eventController.getPlayersViewersCount(ws, message);
          break;
      }
    });

    ws.on("close", () => global.console.log("WS connection CLOSED!"));
  });
}

const t = { id: "werwer", chat: "q3213re", event: "chatHistory" };
