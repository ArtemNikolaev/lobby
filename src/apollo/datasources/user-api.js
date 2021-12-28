const { MongoDataSource } = require("apollo-datasource-mongodb");
const { ObjectId } = require("mongodb");

class UserDataSource extends MongoDataSource {
  async create(userData) {
    const data = await this.collection.insertOne(userData);

    return data.insertedId.toString();
  }

  async findById(id) {
    const data = await this.collection.findOne({ _id: ObjectId(id) });

    if (data) {
      delete data._id;
      return { id, ...data };
    }
  }

  async findByEmail(email) {
    const data = await this.collection.findOne({ email });

    if (data) {
      const id = data._id.toString();
      delete data._id;
      return { id, ...data };
    }
  }

  async findByUsername(username) {
    const data = await this.collection.findOne({ username });

    if (data) {
      const id = data._id.toString();
      delete data._id;
      return { id, ...data };
    }
  }

  async findByLogin(login) {
    const data = await this.collection.findOne({
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
    const data = await this.collection.updateOne(
      { email },
      { $set: { password } }
    );

    return !!data.matchedCount;
  }
}

module.exports = UserDataSource;
