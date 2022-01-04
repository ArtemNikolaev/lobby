const { MongoDataSource } = require("apollo-datasource-mongodb");
const { ObjectId } = require("mongodb");

class TableDataSource extends MongoDataSource {
  async create(tableData) {
    const data = await this.collection.insertOne({
      ...tableData,
      gameId: ObjectId(tableData.gameId),
    });

    return {
      id: data.insertedId.toString(),
      ...tableData,
      gameId: ObjectId(tableData.gameId),
    }
  }

  async findByGameId(gameId) {
    const cursor = this.collection.find({ gameId: ObjectId(gameId) });

    if ((await cursor.count()) === 0) return [];

    return (await cursor.toArray()).map((item) => {
      const id = item._id.toString();
      delete item._id;

      item.id = id;
      return item;
    });
  }

  async deleteById(id) {
    const result = await this.collection.deleteOne({ _id: ObjectId(id) });

    return !!result.deletedCount;
  }

  async findById(id) {
    const data = await this.collection.findOne({ _id: ObjectId(id) });

    if (data) {
      delete data._id;
      return { id, ...data };
    }
  }

  async getTableInfo(id) {
    const cursor = this.collection.aggregate([
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
}

module.exports = TableDataSource;
