const storage = require("./storage");
const userDto = require("../utils/userDto");

async function getProfilePage(id) {
  const userData = await storage.findUserById(id);
  const user = userDto(userData);

  const games = await storage.getGames();

  return { user, games };
}

async function getLobbyPage(gameId) {
  const tables = await storage.findTablesByGameId(gameId);
  const game = await storage.findGamesById(gameId);

  return { tables, game };
}

async function getTablePage(tableId) {
  const table = await storage.findTableById(tableId);

  return table;
}

module.exports = { getProfilePage, getLobbyPage, getTablePage };
