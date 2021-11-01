const pool = require("../../db");

class GameStorage {
  async create(gameData) {
    const data = await pool.query("INSERT INTO games SET ?", gameData);

    return { id: data[0].insertId, ...gameData };
  }
}

module.exports = new GameStorage();
