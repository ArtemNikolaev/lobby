const { ObjectId } = require("mongodb");
const storage = require("./storage");
const { uploadToGCS, deleteFromGCS } = require("../utils/gcs");
const NotFoundError = require("../errors/notFoundError");
const { bucketName } = require("../config");

const GAME_NOT_FOUND = "Game not found";
const TABLE_NOT_FOUND = "Table not found";
const USER_NOT_FOUND = "User not found";

async function createNewGame(parsedForm) {
  const url = await uploadToGCS(parsedForm);

  const { title, description } = parsedForm;
  const id = await storage.createGame({ title, description, url });

  return { id, title, description, url };
}

async function deleteGame(id) {
  const data = await storage.findGameById(id);
  if (!data) throw new NotFoundError(GAME_NOT_FOUND);

  await storage.deleteGameById(id);

  const fileName = data.url.split(`${bucketName}/`)[1];
  await deleteFromGCS(fileName);
}

async function createNewTable(req, userId) {
  const data = await storage.findUserById(userId);
  if (!data) throw new NotFoundError(USER_NOT_FOUND);

  const gameId = req.params["0"].split("/")[1];
  const tableData = {
    creator: data.username,
    game_id: gameId,
    max_players: req.body.maxPlayers,
  };

  const id = await storage.createTable({
    ...tableData,
    game_id: ObjectId(gameId),
  });

  return { id, ...tableData };
}

async function deleteTable(tableId) {
  const { deletedCount } = await storage.deleteTableById(tableId);
  if (deletedCount <= 0) throw new NotFoundError(TABLE_NOT_FOUND);
}

module.exports = { createNewGame, deleteGame, createNewTable, deleteTable };
