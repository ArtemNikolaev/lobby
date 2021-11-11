class ChatStorage {
  constructor() {
    this.storage = new Map();
  }

  async save(key, data) {
    const chat = this.storage.get(key);

    if (!chat) {
      this.storage.set(key, [data]);
    } else {
      chat.push(data);
      this.storage.set(key, chat);
    }
  }

  async getAll(key) {
    return this.storage.get(key);
  }
}

module.exports = new ChatStorage();
