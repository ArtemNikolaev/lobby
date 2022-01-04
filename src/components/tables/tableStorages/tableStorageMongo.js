/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
const { ObjectId } = require("mongodb");
const mongoDB = require("../../../mongodb");

module.exports = class TableStorageMongo {
  constructor() {
    this.tables = mongoDB.getCollection("tables");
  }

  async create(tableData) {
    const data = await this.tables.insertOne({
      ...tableData,
      gameId: ObjectId(tableData.gameId),
    });

    return data.insertedId.toString();
  }

  async findByGameId(gameId) {
    const cursor = this.tables.find({ gameId: ObjectId(gameId) });

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
          localField: "gameId",
          foreignField: "_id",
          as: "game",
        },
      },
      {
        $project: {
          gameId: 1,
          maxPlayers: 1,
          creator: 1,
          "game.title": 1,
          "game.description": 1,
        },
      },
    ]);

    const { _id, creator, gameId, maxPlayers, game } = (
      await cursor.toArray()
    )[0];
    const { title, description } = game[0];

    return {
      id: _id.toString(),
      creator,
      gameId: gameId.toString(),
      maxPlayers,
      title,
      description,
    };
  }
};
