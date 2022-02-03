const { ObjectId } = require("mongodb");
const getCollection = require("../utils/mongoDB");
const NotFoundError = require("../errors/notFoundError");
const {
  usersCollection,
  gamesCollection,
  tablesCollection,
} = require("../config");

const USER_NOT_FOUND = "User not found";

async function findUserById(id) {
  const collection = await getCollection(usersCollection);

  const data = await collection.findOne({ _id: ObjectId(id) });
  if (!data) throw new NotFoundError(USER_NOT_FOUND);

  return { id, ...data };
}

async function getGames() {
  const collection = await getCollection(gamesCollection);

  const cursor = collection.find({});

  if ((await cursor.count()) === 0) return [];

  return (await cursor.toArray()).map((item) => {
    const id = item._id.toString();
    delete item._id;

    item.id = id;
    return item;
  });
}

async function findTablesByGameId(gameId) {
  const collection = await getCollection(tablesCollection);

  const cursor = collection.find({ game_id: ObjectId(gameId) });
  if ((await cursor.count()) === 0) return [];

  return (await cursor.toArray()).map((item) => {
    const id = item._id.toString();
    delete item._id;

    item.id = id;
    return item;
  });
}

async function findGamesById(id) {
  const collection = await getCollection(gamesCollection);

  const data = await collection.findOne({ _id: ObjectId(id) });

  if (data) {
    delete data._id;
    return { id, ...data };
  }
}

async function findTableById(id) {
  const collection = await getCollection(tablesCollection);

  const cursor = collection.aggregate([
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

module.exports = {
  findUserById,
  getGames,
  findTablesByGameId,
  findGamesById,
  findTableById,
};
