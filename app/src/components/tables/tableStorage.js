const pool = require("../../db");

class TableStorage {
  async findByGameId(gameId) {
    return pool.query(
      `SELECT gt.id, gt.game_id, gt.user_id, gt.players, gt.viewers, username as creator, email 
    FROM gametables as gt
    INNER JOIN users
    ON gt.user_id = users.id 
    WHERE game_id = ?`,
      gameId
    );
  }

  async create(tableData) {
    return pool.query("INSERT INTO gametables SET ?", tableData);
  }

  async deleteById(id) {
    return pool.query("DELETE FROM gametables WHERE id = ?", id);
  }

  async findById(id) {
    return pool.query("SELECT * FROM gametables WHERE id = ?", id);
  }
}

module.exports = new TableStorage();
