const WebSocket = require("ws");
const inMemoryStorage = require("../inMemoryStorage/inMemoryStorage");
const chatService = require("./chatService");

class EventService {
  async createTable(wss, data) {
    await inMemoryStorage.addPlayer(data);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ ...data, count: 1 }));
      }
    });
  }

  async deleteTable(wss, data) {
    await chatService.deleteChat("table", data.tableId);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }

  async userJoinTable(wss, data) {
    const count = await inMemoryStorage.addPlayer(data);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ ...data, count }));
      }
    });
  }

  async getPlayersCount(ws, data) {
    const count = await inMemoryStorage.getPlayersCount(data.tableId);

    ws.send(JSON.stringify({ ...data, count }));
  }

  async userLeftTable(wss, data) {
    await inMemoryStorage.deletePlayer(data);
    const count = await inMemoryStorage.getPlayersCount(data.tableId);

    if (count)
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ ...data, count }));
        }
      });
  }
}

module.exports = new EventService();
