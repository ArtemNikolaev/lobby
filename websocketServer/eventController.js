const WebSocket = require("ws");
const pvStorage = require("./storages/pvStorage");
const chatStorage = require("./storages/chatStorage");

class EventController {
  async saveChatMessage(wss, data) {
    const { chat, id, chatData } = data;
    const key = `${chat}-${id}`;

    await chatStorage.save(key, chatData);
    const history = await chatStorage.getAllMessages(key);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ ...data, chatData: history }));
      }
    });
  }

  async getChatHistory(ws, data) {
    const { chat, id } = data;

    const chatData = await chatStorage.getAllMessages(`${chat}-${id}`);
    ws.send(JSON.stringify({ ...data, chatData }));
  }

  async addGame(wss, data) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }

  async deleteGame(wss, data) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }

  async createTable(wss, data) {
    const id = data.tableId.toString();

    await pvStorage.create({ id, ...data });

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({ ...data, count: { players: 1, viewers: 0 } })
        );
      }
    });
  }

  async deleteTable(wss, data) {
    const key = `table-${data.tableId}`;

    await chatStorage.delete(key);
    await pvStorage.deleteAll(data.tableId.toString());

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }

  async userJoinTable(wss, data) {
    const id = data.tableId.toString();

    await pvStorage.add(id, data.userId);
    const count = await pvStorage.getCount(id);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ ...data, count }));
      }
    });
  }

  async userLeftTable(wss, data) {
    const id = data.tableId.toString();

    await pvStorage.deleteOne(id, data.userId);
    const count = await pvStorage.getCount(id);

    if (count.players) {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ ...data, count }));
        }
      });
    }
  }

  async getPlayersViewersCount(ws, data) {
    const count = await pvStorage.getCount(data.tableId.toString());

    ws.send(JSON.stringify({ ...data, count }));
  }
}

module.exports = new EventController();
