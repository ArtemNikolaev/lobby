const { ObjectId } = require("mongodb");
const mongoDB = require("../../../mongodb");

module.exports = class UserStorageMongo {
  constructor() {
    this.users = mongoDB.getCollection("users");
  }

  async create(userData) {
    const data = await this.users.insertOne(userData);

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
};
