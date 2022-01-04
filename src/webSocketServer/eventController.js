const WebSocket = require("ws");
const pvStorage = require("../components/players-viewers/pvStorage");
const chatStorage = require("../components/chat/chatStorage");
const { pubsub } = require("../apollo/pubsub");
const { wsEvents } = require("../../config");

class EventController {
  async saveChatMessage(id, chat, chatData) {
    const key = `${chat}-${id}`;

    await chatStorage.save(key, chatData);
    const history = await chatStorage.getAllMessages(key);

    await pubsub.publish(wsEvents.chatMessageEvent, history);

    return history;
  }

  async getChatHistory(id, chat) {
    return await chatStorage.getAllMessages(`${chat}-${id}`);
  }

  async createTable({ id, gameId, creator, maxPlayers }) {
    const key = id.toString();

    await pvStorage.create({ key, id, gameId, creator, maxPlayers });

    await pubsub.publish(wsEvents.createTableEvent, {
      id,
      gameId,
      creator,
      maxPlayers,
      count: { players: 1, viewers: 0 },
    });
  }

  async deleteTable(id) {
    const key = `table-${id}`;

    await chatStorage.delete(key);
    await pvStorage.deleteAll(id.toString());

    await pubsub.publish(wsEvents.deleteTableEvent, { id });
  }

  async userJoinTable(id, userId) {
    const key = data.tableId.toString();

    await pvStorage.add(key, userId);
    const count = await pvStorage.getCount(key);

    await pubsub.publish(wsEvents.userJoinTableEvent, { id, userId, count });
  }

  async userLeftTable(id, userId) {
    const key = id.toString();

    await pvStorage.deleteOne(key, userId);
    const count = await pvStorage.getCount(key);

    if (count.players) {
      await pubsub.publish(wsEvents.userLeftTableEvent, { id, userId, count });
    }
  }

  async getPlayersViewersCount(tableId) {
    return await pvStorage.getCount(tableId.toString());
  }
}

module.exports = new EventController();
