const pool = require("../../db");

class GameStorage {
  async create(gameData) {
    const data = await pool.query("INSERT INTO games SET ?", gameData);

    return { id: data[0].insertId, ...gameData };
  }

  async getAll() {
    return pool.query("SELECT * FROM games");
  }
}

module.exports = new GameStorage();
