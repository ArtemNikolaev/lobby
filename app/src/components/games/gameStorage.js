const pool = require("../../db");

class GameStorage {
  async create(gameData) {
    const data = await pool.query("INSERT INTO games SET ?", gameData);

    return data[0].insertId;
  }

  async getAll() {
    const data = await pool.query("SELECT * FROM games");

    return data[0];
  }

  async findById(id) {
    const [data] = await pool.query("SELECT * FROM games WHERE id = ?", id);

    return data[0];
  }

  async deleteById(id) {
    return pool.query("DELETE FROM games WHERE id = ?", id);
  }
}

module.exports = new GameStorage();
