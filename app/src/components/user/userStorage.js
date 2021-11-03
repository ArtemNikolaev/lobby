const pool = require("../../db");

class UserStorage {
  async create(userData) {
    return pool.query("INSERT INTO users SET ?", userData);
  }

  async findById(id) {
    return pool.query("SELECT * FROM users WHERE id = ?", id);
  }

  async findByEmail(email) {
    return pool.query("SELECT * FROM users WHERE email = ?", email);
  }

  async findByUsername(username) {
    return pool.query("SELECT * FROM users WHERE username = ?", username);
  }

  async find(login) {
    return pool.query("SELECT * FROM users WHERE email = ? OR username = ?", [
      login,
      login,
    ]);
  }

  async updatePassword(userData) {
    const { email, password } = userData;
    return pool.query("UPDATE users SET password = ? WHERE email = ?", [
      password,
      email,
    ]);
  }
}

module.exports = new UserStorage();
