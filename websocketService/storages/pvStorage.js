const redis = require("../utils/redis");

class PlayersViewersStorage {
  constructor() {
    this.storage = redis.createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    });
    this.prefix = "pv::tableId:";
  }

  async create({ id, userId, maxPlayers }) {
    return this.storage.hsetAsync(
      this.prefix + id,
      "players",
      JSON.stringify([userId]),
      "viewers",
      JSON.stringify([]),
      "maxPlayers",
      maxPlayers
    );
  }

  async add(id, userId) {
    const { players, maxPlayers } = await this.getCount(id);
    const type = players < maxPlayers ? "players" : "viewers";

    if (type === "viewers") if (await this.playerExist(id, userId)) return;
    const usersJson = await this.storage.hgetAsync(this.prefix + id, type);

    const array = JSON.parse(usersJson).filter((i) => i !== userId);
    array.push(userId);

    await this.storage.hsetAsync(this.prefix + id, type, JSON.stringify(array));
  }

  async deleteOne(id, userId) {
    const { players, viewers } = await this.getData(id);

    let index = players.indexOf(userId);
    if (index >= 0) {
      players.splice(index, 1);
    } else {
      index = viewers.indexOf(userId);
      viewers.splice(index, 1);
    }

    await this.storage.hsetAsync(
      this.prefix + id,
      "players",
      JSON.stringify(players),
      "viewers",
      JSON.stringify(viewers)
    );
  }

  async playerExist(id, userId) {
    const playersJson = await this.storage.hgetAsync(
      this.prefix + id,
      "players"
    );
    return JSON.parse(playersJson).some((i) => i === userId);
  }

  async getCount(id) {
    const { players, viewers, maxPlayers } = await this.getData(id);

    return {
      players: players.length,
      viewers: viewers.length,
      maxPlayers,
    };
  }

  async deleteAll(id) {
    await this.storage.delAsync(this.prefix + id);
  }

  async getData(id) {
    const [playersJson, viewersJson, maxPlayers] =
      await this.storage.hvalsAsync(this.prefix + id);

    return {
      players: JSON.parse(playersJson),
      viewers: JSON.parse(viewersJson),
      maxPlayers: parseInt(maxPlayers, 10),
    };
  }
}

module.exports = new PlayersViewersStorage();
