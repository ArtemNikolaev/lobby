const redis = require("../utils/redis");

class IdsStorage {
  constructor() {
    this.storage = redis.createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    });
    this.key = "connections";
  }

  async save(id) {
    return this.storage.saddAsync(this.key, id);
  }

  async getAll() {
    return this.storage.smembersAsync(this.key);
  }

  async delete(id) {
    return this.storage.sremAsync(this.key, id);
  }
}

module.exports = new IdsStorage();
