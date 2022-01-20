const pvStorage = require("./storages/pvStorage");
const chatStorage = require("./storages/chatStorage");
const idsStorage = require("./storages/connectionsStorage");
const send = require("./utils/send");

class EventController {
  async saveConnectionId(connectionId) {
    await idsStorage.save(connectionId);
  }

  async deleteConnectionId(connectionId) {
    await idsStorage.delete(connectionId);
  }

  async saveChatMessage(client, json) {
    const data = JSON.parse(json);

    const { chat, id, chatData } = data;
    const key = `${chat}-${id}`;

    await chatStorage.save(key, chatData);
    const history = await chatStorage.getAllMessages(key);

    const connectionIds = await idsStorage.getAll();
    await Promise.all(
      connectionIds.map((c) => send(client, c, { ...data, chatData: history }))
    );
  }

  async getChatHistory(client, connectionId, json) {
    const data = JSON.parse(json);
    const { chat, id } = data;

    const chatData = await chatStorage.getAllMessages(`${chat}-${id}`);
    await send(client, connectionId, { ...data, chatData });
  }

  async addGame(client, json) {
    const connectionIds = await idsStorage.getAll();

    await Promise.all(
      connectionIds.map((c) => send(client, c, JSON.parse(json)))
    );
  }

  async deleteGame(client, json) {
    const connectionIds = await idsStorage.getAll();

    await Promise.all(
      connectionIds.map((c) => send(client, c, JSON.parse(json)))
    );
  }

  async createTable(client, json) {
    const data = JSON.parse(json);
    const id = data.tableId.toString();

    await pvStorage.create({ id, ...data });

    const connectionIds = await idsStorage.getAll();
    await Promise.all(
      connectionIds.map((c) =>
        send(client, c, {
          ...data,
          count: { players: 1, viewers: 0 },
        })
      )
    );
  }

  async deleteTable(client, json) {
    const data = JSON.parse(json);
    const key = `table-${data.tableId}`;

    await chatStorage.delete(key);
    await pvStorage.deleteAll(data.tableId.toString());

    const connectionIds = await idsStorage.getAll();
    await Promise.all(connectionIds.map((c) => send(client, c, data)));
  }

  async userJoinTable(client, json) {
    const data = JSON.parse(json);
    const id = data.tableId.toString();

    await pvStorage.add(id, data.userId);
    const count = await pvStorage.getCount(id);

    const connectionIds = await idsStorage.getAll();
    await Promise.all(
      connectionIds.map((c) => send(client, c, { ...data, count }))
    );
  }

  async userLeftTable(client, json) {
    const data = JSON.parse(json);
    const id = data.tableId.toString();

    await pvStorage.deleteOne(id, data.userId);
    const count = await pvStorage.getCount(id);

    if (count.players) {
      const connectionIds = await idsStorage.getAll();

      await Promise.all(
        connectionIds.map((c) => send(client, c, { ...data, count }))
      );
    }
  }

  async getPlayersViewersCount(client, connectionId, json) {
    const data = JSON.parse(json);
    const count = await pvStorage.getCount(data.tableId.toString());

    await send(client, connectionId, { ...data, count });
  }
}

module.exports = new EventController();
