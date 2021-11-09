class WSStorage {
  constructor() {
    this.storage = new Map();
  }

  async save(message) {
    const { id, chatData } = message;

    const chat = this.storage.get(id);
    if (!chat) {
      this.storage.set(id, [chatData]);
      return [chatData];
    }

    chat.push(chatData);
    this.storage.set(id, chat);

    return chat;
  }

  async getChatById(id) {
    return this.storage.get(id);
  }
}

module.exports = new WSStorage();
