const pool = require("../../../db");

module.exports = class TableStorageMysql {
  async create(tableData) {
    const [data] = await pool.query("INSERT INTO tables SET ?", tableData);

    return data.insertId;
  }

  async findByGameId(gameId) {
    const [data] = await pool.query(
      `SELECT * FROM tables WHERE game_id = ?`,
      parseInt(gameId)
    );

    return data;
  }

  async deleteById(id) {
    const [result] = await pool.query(
      "DELETE FROM tables WHERE id = ?",
      parseInt(id)
    );

    return !!result.affectedRows;
  }

  async findById(id) {
    const [table] = await pool.query(
      "SELECT * FROM tables WHERE id = ?",
      parseInt(id)
    );

    return table[0];
  }

  async getTableInfo(id) {
    const [table] = await pool.query(
      `SELECT 
            t.id, 
            t.creator, 
            t.game_id as gameId, 
            t.max_players,
            g.title, 
            g.description
      FROM tables as t
      INNER JOIN games as g
      ON t.game_id = g.id
      WHERE t.id = ?`,
      parseInt(id)
    );

    return table[0];
  }
};
