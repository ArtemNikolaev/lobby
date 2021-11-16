class ChatStorage {
  constructor() {
    this.storage = new Map();
  }

  async save(key, data) {
    const chat = this.storage.get(key);

    chat.push(data);
    this.storage.set(key, chat);
  }

  async getAllMessages(key) {
    const chat = this.storage.get(key);
    if (chat) return chat;

    const botMessage = {
      username: "Chat Bot",
      message: `Welcome to our chat "${key}"`,
      date: new Date(),
    };
    this.storage.set(key, [botMessage]);

    return [botMessage];
  }

  async delete(key) {
    this.storage.delete(key);
  }
}

module.exports = new ChatStorage();
