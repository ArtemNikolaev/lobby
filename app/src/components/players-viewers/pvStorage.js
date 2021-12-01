class PlayersViewersStorage {
  constructor() {
    this.storage = new Map();
    this.maxPlayers = 2;
  }

  async create({ key, userId, maxPlayers }) {
    this.maxPlayers = maxPlayers;
    this.storage.set(key, {
      players: new Set().add(userId),
      viewers: new Set(),
    });
  }

  async add(key, userId) {
    const playersCount = (await this.getCount(key)).players;
    const type = playersCount < this.maxPlayers ? "players" : "viewers";

    if (type === "viewers") if (await this.playerExist(key, userId)) return;

    const users = this.storage.get(key);
    users[type].add(userId);

    this.storage.set(key, users);
  }

  async deleteOne(key, userId) {
    const users = this.storage.get(key);

    const deleted = users.players.delete(userId);
    if (!deleted) users.viewers.delete(userId);

    this.storage.set(key, users);
  }

  async playerExist(key, userId) {
    return this.storage.get(key).players.has(userId);
  }

  async getCount(key) {
    const obj = this.storage.get(key);

    return { players: obj.players.size, viewers: obj.viewers.size };
  }

  async deleteAll(key) {
    this.storage.delete(key);
  }
}

module.exports = new PlayersViewersStorage();
