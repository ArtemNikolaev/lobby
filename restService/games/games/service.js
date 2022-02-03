const { MongoClient, ObjectId } = require("mongodb");
const { uploadToGCS, deleteFromGCS } = require("../utils/gcs");
const NotFoundError = require("../errors/notFoundError");
const {
  mongoUri,
  dbName,
  gamesCollection,
  usersCollection,
  tablesCollection,
  bucketName,
} = require("../config");

const client = new MongoClient(mongoUri);
const GAME_NOT_FOUND = "Game not found";
const TABLE_NOT_FOUND = "Table not found";
const USER_NOT_FOUND = "User not found";

async function createGame(parsedForm) {
  await client.connect();
  const games = client.db(dbName).collection(gamesCollection);

  const url = await uploadToGCS(parsedForm);

  const { title, description } = parsedForm;
  const data = await games.insertOne({ title, description, url });

  return { id: data.insertedId.toString(), title, description, url };
}

async function deleteGame(id) {
  await client.connect();
  const games = client.db(dbName).collection(gamesCollection);

  const data = await games.findOne({ _id: ObjectId(id) });
  if (!data) throw new NotFoundError(GAME_NOT_FOUND);

  await games.deleteOne({ _id: ObjectId(id) });

  const fileName = data.url.split(`${bucketName}/`)[1];
  await deleteFromGCS(fileName);
}

async function createTable(req, payload) {
  await client.connect();
  const users = client.db(dbName).collection(usersCollection);

  const data = await users.findOne({ _id: ObjectId(payload.id) });
  if (!data) throw new NotFoundError(USER_NOT_FOUND);

  const gameId = req.params["0"].split("/")[1];
  const tableData = {
    creator: data.username,
    game_id: gameId,
    max_players: req.body.maxPlayers,
  };

  const tables = client.db(dbName).collection(tablesCollection);
  const { insertedId } = await tables.insertOne({
    ...tableData,
    game_id: ObjectId(gameId),
  });

  return { id: insertedId.toString(), ...tableData };
}

async function deleteTable(tableId) {
  await client.connect();
  const tables = client.db(dbName).collection(tablesCollection);

  const { deletedCount } = tables.deleteOne({ _id: ObjectId(tableId) });
  if (deletedCount <= 0) throw new NotFoundError(TABLE_NOT_FOUND);
}

module.exports = { createGame, deleteGame, createTable, deleteTable };
