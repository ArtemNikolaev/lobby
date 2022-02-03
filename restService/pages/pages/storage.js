const { MongoClient, ObjectId } = require("mongodb");
const NotFoundError = require("../errors/notFoundError");
const {
  dbName,
  mongoUri,
  usersCollection,
  gamesCollection,
  tablesCollection,
} = require("../config");

const client = new MongoClient(mongoUri);
const USER_NOT_FOUND = "User not found";

exports.findUserById = async (id) => {
  await client.connect();
  const users = client.db(dbName).collection(usersCollection);

  const data = await users.findOne({ _id: ObjectId(id) });
  if (!data) throw new NotFoundError(USER_NOT_FOUND);

  return { id, ...data };
};

exports.getGames = async () => {
  await client.connect();
  const games = client.db(dbName).collection(gamesCollection);

  const cursor = games.find({});

  if ((await cursor.count()) === 0) return [];

  return (await cursor.toArray()).map((item) => {
    const id = item._id.toString();
    delete item._id;

    item.id = id;
    return item;
  });
};

exports.findTablesByGameId = async (gameId) => {
  await client.connect();
  const tables = client.db(dbName).collection(tablesCollection);

  const cursor = tables.find({ game_id: ObjectId(gameId) });
  if ((await cursor.count()) === 0) return [];

  return (await cursor.toArray()).map((item) => {
    const id = item._id.toString();
    delete item._id;

    item.id = id;
    return item;
  });
};

exports.findGamesById = async (id) => {
  await client.connect();
  const games = client.db(dbName).collection(gamesCollection);

  const data = await games.findOne({ _id: ObjectId(id) });

  if (data) {
    delete data._id;
    return { id, ...data };
  }
};

exports.findTableById = async (id) => {
  await client.connect();
  const tables = client.db(dbName).collection(tablesCollection);

  const cursor = tables.aggregate([
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
};
