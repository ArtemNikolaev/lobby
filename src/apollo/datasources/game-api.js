const { MongoDataSource } = require("apollo-datasource-mongodb");
const { ObjectId } = require("mongodb");

class GameDataSource extends MongoDataSource {
  async create(gameData) {
    const data = await this.collection.insertOne(gameData);

    return { id: data.insertedId.toString(), ...gameData };
  }

  async getAll() {
    const cursor = this.collection.find({});

    if ((await cursor.count()) === 0) return [];

    return (await cursor.toArray()).map((item) => {
      const id = item._id.toString();
      delete item._id;

      item.id = id;
      return item;
    });
  }

  async findById(id) {
    const data = await this.collection.findOne({ _id: ObjectId(id) });

    if (data) {
      delete data._id;
      return { id, ...data };
    }
  }

  async deleteById(id) {
    const result = await this.collection.deleteOne({ _id: ObjectId(id) });

    return !!result.deletedCount;
  }
}

module.exports = GameDataSource;
