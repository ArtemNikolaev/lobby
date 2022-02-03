const {
  findUserById,
  getGames,
  findTablesByGameId,
  findGamesById,
  findTableById,
} = require("./storage");
const userDto = require("../utils/userDto");

class Service {
  async getProfilePage(id) {
    const userData = await findUserById(id);
    const user = userDto(userData);

    const games = await getGames();

    return { user, games };
  }

  async getLobbyPage(gameId) {
    const tables = await findTablesByGameId(gameId);
    const game = await findGamesById(gameId);

    return { tables, game };
  }

  async getTablePage(tableId) {
    const table = await findTableById(tableId);

    return table;
  }
}

module.exports = new Service();
