const chatStorage = require("./chatStorage");

class ChatService {
  async saveMessage({ chat, id, chatData }) {
    const key = `${chat}-${id}`;

    await chatStorage.save(key, chatData);
  }

  async getChatHistory({ chat, id }) {
    const key = `${chat}-${id}`;

    return chatStorage.getAll(key);
  }

  async deleteChat(chat, id) {
    const key = `${chat}-${id}`;

    await chatStorage.delete(key);
  }
}

module.exports = new ChatService();
