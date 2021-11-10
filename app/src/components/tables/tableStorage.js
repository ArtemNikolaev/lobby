const pool = require("../../db");

class TableStorage {
  async findByGameId(gameId) {
    return pool.query(
      `SELECT 
            t.id, 
            t.game_id, 
            t.user_id, 
            t.players, 
            t.viewers, 
            u.id as creatorId, 
            username as creator 
      FROM tables as t
      INNER JOIN users as u
      ON t.user_id = u.id 
      WHERE game_id = ?`,
      gameId
    );
  }

  async create(tableData) {
    const [data] = await pool.query("INSERT INTO tables SET ?", tableData);

    return data.insertId;
  }

  async deleteById(id) {
    return pool.query("DELETE FROM tables WHERE id = ?", id);
  }

  async findById(id) {
    const [table] = await pool.query("SELECT * FROM tables WHERE id = ?", id);

    return table[0];
  }

  async findGameAndTableById(id) {
    const [table] = await pool.query(
      `SELECT 
            t.id, 
            t.players, 
            t.viewers, 
            u.id as creatorId, 
            u.username as creator, 
            g.id as gameId, 
            g.title, 
            g.description
      FROM tables as t
      INNER JOIN users as u
      ON t.user_id = u.id 
      INNER JOIN games as g
      ON t.game_id = g.id
      WHERE t.id = ?`,
      id
    );

    return table[0];
  }
}

module.exports = new TableStorage();
