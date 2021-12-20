class PlayersViewersStorage {
  constructor() {
    this.storage = new Map();
  }

  async add(type, data) {
    const { tableId, userId } = data;
    const key = `${type}-${tableId}`;

    if (type === "viewers") if (await this.playerExist(data)) return;

    const users = this.storage.get(key);

    if (!users) {
      this.storage.set(key, new Set().add(userId));
      return;
    }

    users.add(userId);
    this.storage.set(key, users);
  }

  async deleteOne(type, { tableId, userId }) {
    const key = `${type}-${tableId}`;

    let users = this.storage.get(key);
    if (!users) throw new Error("Data not found");

    users.delete(userId);
    this.storage.set(key, users);
  }

  async playerExist({ tableId, userId }) {
    const key = `players-${tableId}`;

    return this.storage.get(key).has(userId);
  }

  async getCount(id) {
    const playersData = this.storage.get(`players-${id}`);
    const viewersData = this.storage.get(`viewers-${id}`);

    const players = playersData ? playersData.size : 0;
    const viewers = viewersData ? viewersData.size : 0;

    return { players, viewers };
  }

  async deleteAll(id) {
    this.storage.delete(`players-${id}`);
    this.storage.delete(`viewers-${id}`);
  }
}

module.exports = new PlayersViewersStorage();
