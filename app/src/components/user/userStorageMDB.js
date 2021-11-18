const client = require("../../mongodb");
const { ObjectId } = require("mongodb");

class UserStorage {
  constructor() {
    client
      .connect()
      .then((client) => (this.users = client.db("lobby").collection("users")));
  }

  async create(userData) {
    const data = await this.users.insertOne({ ...userData, role: "user" });

    return data.insertedId.toString();
  }

  async findById(id) {
    const data = await this.users.findOne({ _id: ObjectId(id) });

    if (data) {
      delete data._id;
      return { id, ...data };
    }
  }

  async findByEmail(email) {
    const data = await this.users.findOne({ email });

    if (data) {
      const id = data._id.toString();
      delete data._id;
      return { id, ...data };
    }
  }

  async findByUsername(username) {
    const data = await this.users.findOne({ username });

    if (data) {
      const id = data._id.toString();
      delete data._id;
      return { id, ...data };
    }
  }

  async findByLogin(login) {
    const data = await this.users.findOne({
      $or: [{ username: login }, { email: login }],
    });

    if (data) {
      const id = data._id.toString();
      delete data._id;
      return { id, ...data };
    }
  }

  async updatePassword(userData) {
    const { email, password } = userData;
    const data = await this.users.updateOne({ email }, { $set: { password } });

    return !!data.matchedCount;
  }
}

module.exports = new UserStorage();
