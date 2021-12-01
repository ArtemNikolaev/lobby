const pool = require("../../../db");

module.exports = class GameStorageMysql {
  async create(gameData) {
    const data = await pool.query("INSERT INTO games SET ?", gameData);

    return data[0].insertId;
  }

  async getAll() {
    const data = await pool.query("SELECT * FROM games");

    return data[0];
  }

  async findById(id) {
    const [data] = await pool.query(
      "SELECT * FROM games WHERE id = ?",
      parseInt(id, 10)
    );

    return data[0];
  }

  async deleteById(id) {
    const result = await pool.query(
      "DELETE FROM games WHERE id = ?",
      parseInt(id, 10)
    );

    return !!result.affectedRows;
  }
};
