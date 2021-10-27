const pool = require("../../db");

class UserStorage {
  async create(userData) {
    const data = await pool.query("INSERT INTO users SET ?", userData);

    return { id: data[0].insertId, ...userData };
  }

  async findById(id) {
    const [data] = await pool.query("SELECT * FROM users WHERE id = ?", id);

    return data[0];
  }

  async findByEmail(email) {
    const [data] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      email
    );

    return data[0];
  }

  async findByUsername(username) {
    const [data] = await pool.query(
      "SELECT * FROM users WHERE username = ?",
      username
    );

    return data[0];
  }

  async find(login) {
    const [data] = await pool.query(
      "SELECT * FROM users WHERE email = ? OR username = ?",
      [login, login]
    );

    return data[0];
  }
}

module.exports = new UserStorage();
