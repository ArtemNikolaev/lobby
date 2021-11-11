const pool = require("../../db");

class PlayersTablesStorage {
  async create(data) {
    const [value] = await pool.query("INSERT INTO players_tables SET ?", data);
    console.log(value);
    // return data.insertId;
  }
}

module.exports = new PlayersTablesStorage();
