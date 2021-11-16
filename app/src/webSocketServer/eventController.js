const WebSocket = require("ws");
const pvStorage = require("../components/players-viewers/pvStorage");
const chatStorage = require("../components/chat/chatStorage");

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
    await pvStorage.add("players", data);

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
    await pvStorage.deleteAll(data.tableId);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }

  async userJoinTable(wss, data) {
    let count = await pvStorage.getCount(data.tableId);

    if (count.players < 2) {
      await pvStorage.add("players", data);
    } else {
      await pvStorage.add("viewers", data);
    }

    count = await pvStorage.getCount(data.tableId);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ ...data, count }));
      }
    });
  }

  async userLeftTable(wss, data) {
    const exist = await pvStorage.playerExist(data);

    exist
      ? await pvStorage.deleteOne("players", data)
      : await pvStorage.deleteOne("viewers", data);

    const count = await pvStorage.getCount(data.tableId);

    if (count.players)
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ ...data, count }));
        }
      });
  }

  async getPlayersViewersCount(ws, data) {
    const count = await pvStorage.getCount(data.tableId);
    console.log(count);
    ws.send(JSON.stringify({ ...data, count }));
  }
}

module.exports = new EventController();
