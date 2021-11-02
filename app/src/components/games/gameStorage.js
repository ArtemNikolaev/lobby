const pool = require("../../db");

class GameStorage {
  async create(gameData) {
    return pool.query("INSERT INTO games SET ?", gameData);
  }

  async getAll() {
    return pool.query("SELECT * FROM games");
  }

  async deleteById(id) {
    return pool.query("DELETE FROM games WHERE id = ?", id);
  }
}

module.exports = new GameStorage();
