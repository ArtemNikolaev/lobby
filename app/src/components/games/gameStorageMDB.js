const client = require("../../mongodb");
const { ObjectId } = require("mongodb");

class GameStorage {
  constructor() {
    client
      .connect()
      .then((client) => (this.games = client.db("lobby").collection("games")));
  }

  async create(gameData) {
    const data = await this.games.insertOne(gameData);

    return data.insertedId.toString();
  }

  async getAll() {
    const cursor = this.games.find({});

    if ((await cursor.count()) === 0) return [];

    return (await cursor.toArray()).map((item) => {
      const id = item._id.toString();
      delete item._id;

      item.id = id;
      return item;
    });
  }

  async findById(id) {
    const data = await this.games.findOne({ _id: ObjectId(id) });

    if (data) {
      delete data._id;
      return { id, ...data };
    }
  }

  async deleteById(id) {
    await this.games.deleteOne({ _id: ObjectId(id) });
  }
}

module.exports = new GameStorage();
