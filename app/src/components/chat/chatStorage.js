class ChatStorage {
  constructor() {
    this.storage = new Map();
  }

  async create(key) {
    const botMessage = {
      username: "Chat Bot",
      message: `Welcome! Chat ${key}`,
      date: new Date(),
    };
    this.storage.set(key, [botMessage]);
  }

  async save(key, data) {
    const chat = this.storage.get(key);

    chat.push(data);
    this.storage.set(key, chat);
  }

  async getAllMessages(key) {
    const chat = this.storage.get(key);
    if (!chat) await this.create(key);

    return this.storage.get(key);
  }

  async delete(key) {
    this.storage.delete(key);
  }
}

module.exports = new ChatStorage();
