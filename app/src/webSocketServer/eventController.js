const WebSocket = require("ws");
const playerStorage = require("../components/players/playerStorage");
const chatStorage = require("./chat/chatStorage");

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
    const key = `${chat}-${id}`;

    const chatData = await chatStorage.getAllMessages(key);

    ws.send(JSON.stringify({ ...data, chatData }));
  }

  async createTable(wss, data) {
    await playerStorage.addPlayer(data);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ ...data, count: 1 }));
      }
    });
  }

  async deleteTable(wss, data) {
    const key = `table-${data.tableId}`;

    await chatStorage.delete(key);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }

  async userJoinTable(wss, data) {
    await playerStorage.addPlayer(data);
    const count = await playerStorage.getCount(data.tableId);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ ...data, count }));
      }
    });
  }

  async getPlayersCount(ws, data) {
    const count = await playerStorage.getCount(data.tableId);

    ws.send(JSON.stringify({ ...data, count }));
  }

  async userLeftTable(wss, data) {
    await playerStorage.deletePlayer(data);
    const count = await playerStorage.getCount(data.tableId);

    if (count)
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ ...data, count }));
        }
      });
  }
}

module.exports = new EventController();
