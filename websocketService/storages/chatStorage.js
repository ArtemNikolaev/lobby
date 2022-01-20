const redis = require("../utils/redis");

class ChatStorage {
  constructor() {
    this.storage = redis.createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    });
  }

  async create(key) {
    const botMessage = {
      username: "Chat Bot",
      message: `Welcome! Chat ${key}`,
      date: new Date(),
    };

    await this.storage.rpushAsync(key, JSON.stringify(botMessage));
  }

  async save(key, data) {
    await this.storage.rpushAsync(key, JSON.stringify(data));
  }

  async getAllMessages(key) {
    if (!(await this.storage.existsAsync(key))) await this.create(key);

    const arrayJson = await this.storage.lrangeAsync(key, 0, -1);
    return arrayJson.map(JSON.parse);
  }

  async delete(key) {
    await this.storage.delAsync(key);
  }
}

module.exports = new ChatStorage();
