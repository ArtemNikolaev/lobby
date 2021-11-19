const pool = require("../../db");

class UserStorage {
  async create(userData) {
    const [data] = await pool.query("INSERT INTO users SET ?", userData);

    return data.insertId;
  }

  async findById(id) {
    const [data] = await pool.query(
      "SELECT * FROM users WHERE id = ?",
      parseInt(id)
    );

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

  async findByLogin(login) {
    const [data] = await pool.query(
      "SELECT * FROM users WHERE email = ? OR username = ?",
      [login, login]
    );

    return data[0];
  }

  async updatePassword(userData) {
    const { email, password } = userData;
    const [data] = await pool.query(
      "UPDATE users SET password = ? WHERE email = ?",
      [password, email]
    );

    return !!data.affectedRows;
  }
}

module.exports = new UserStorage();
