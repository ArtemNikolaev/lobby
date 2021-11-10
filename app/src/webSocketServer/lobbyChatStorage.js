class LobbyChatStorage {
  constructor() {
    this.storage = new Map();
  }

  async save({ id, chatData }) {
    const chat = this.storage.get(id);
    if (!chat) {
      this.storage.set(id, [chatData]);
    } else {
      chat.push(chatData);
      this.storage.set(id, chat);
    }
  }

  async getChatById(id) {
    return this.storage.get(id);
  }
}

module.exports = new LobbyChatStorage();
