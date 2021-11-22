const { ObjectId } = require("mongodb");
const mongoDB = require("../../../mongodb");

module.exports = class TableStorageMongo {
  constructor() {
    this.tables = mongoDB.getCollection("tables");
  }

  async create(tableData) {
    const data = await this.tables.insertOne({
      ...tableData,
      game_id: ObjectId(tableData.game_id),
    });

    return data.insertedId.toString();
  }

  async findByGameId(gameId) {
    const cursor = this.tables.find({ game_id: ObjectId(gameId) });

    if ((await cursor.count()) === 0) return [];

    return (await cursor.toArray()).map((item) => {
      const id = item._id.toString();
      delete item._id;

      item.id = id;
      return item;
    });
  }

  async deleteById(id) {
    const result = await this.tables.deleteOne({ _id: ObjectId(id) });

    return !!result.deletedCount;
  }

  async findById(id) {
    const data = await this.tables.findOne({ _id: ObjectId(id) });

    if (data) {
      delete data._id;
      return { id, ...data };
    }
  }

  async getTableInfo(id) {
    const cursor = this.tables.aggregate([
      { $match: { _id: ObjectId(id) } },
      {
        $lookup: {
          from: "games",
          localField: "game_id",
          foreignField: "_id",
          as: "game",
        },
      },
      {
        $project: {
          game_id: 1,
          max_players: 1,
          creator: 1,
          "game.title": 1,
          "game.description": 1,
        },
      },
    ]);

    const { _id, creator, game_id, max_players, game } = (
      await cursor.toArray()
    )[0];
    const { title, description } = game[0];

    return {
      id: _id.toString(),
      creator,
      gameId: game_id.toString(),
      max_players,
      title,
      description,
    };
  }
};
