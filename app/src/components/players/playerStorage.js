class PlayerStorage {
  constructor() {
    this.storage = new Map();
  }

  async addPlayer(data) {
    const { tableId, userId } = data;
    const players = this.storage.get(tableId);

    if (!players) {
      this.storage.set(tableId, new Set().add(userId));
      return;
    }

    players.add(userId);
    this.storage.set(tableId, players);
  }

  async getCount(id) {
    const players = this.storage.get(id);

    return players ? players.size : 0;
  }

  async deletePlayer({ tableId, userId }) {
    let players = this.storage.get(tableId);
    if (!players) throw new Error("Table-Players data not found");

    players.delete(userId);
    this.storage.set(tableId, players);
  }
}

module.exports = new PlayerStorage();
