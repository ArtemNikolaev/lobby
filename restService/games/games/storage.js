const { MongoClient, ObjectId } = require("mongodb");
const {
  mongoUri,
  dbName,
  gamesCollection,
  usersCollection,
  tablesCollection,
} = require("../config");

const client = new MongoClient(mongoUri);

exports.createGame = async (gameData) => {
  await client.connect();
  const games = client.db(dbName).collection(gamesCollection);

  const data = await games.insertOne(gameData);

  return data.insertedId.toString();
};

exports.findGameById = async (id) => {
  await client.connect();
  const games = client.db(dbName).collection(gamesCollection);

  return games.findOne({ _id: ObjectId(id) });
};

exports.deleteGameById = async (id) => {
  await client.connect();
  const games = client.db(dbName).collection(gamesCollection);

  await games.deleteOne({ _id: ObjectId(id) });
};

exports.findUserById = async (id) => {
  await client.connect();
  const users = client.db(dbName).collection(usersCollection);

  return users.findOne({ _id: ObjectId(id) });
};

exports.createTable = async (tableData) => {
  await client.connect();
  const tables = client.db(dbName).collection(tablesCollection);

  const data = await tables.insertOne(tableData);

  return data.insertedId.toString();
};

exports.deleteTableById = async (tableId) => {
  await client.connect();
  const tables = client.db(dbName).collection(tablesCollection);

  return tables.deleteOne({ _id: ObjectId(tableId) });
};
