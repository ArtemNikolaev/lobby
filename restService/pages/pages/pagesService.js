const {
  findUserById,
  getGames,
  findTablesByGameId,
  findGamesById,
  findTableById,
} = require("./storage");
const userDto = require("../utils/userDto");
const errorObject = require("../utils/errorObject");

class PagesService {
  async getProfilePage(id) {
    try {
      const userData = await findUserById(id);
      const user = userDto(userData);

      const games = await getGames();

      return { statusCode: 200, body: { user, games } };
    } catch (error) {
      return errorObject(error);
    }
  }

  async getLobbyPage(gameId) {
    try {
      const tables = await findTablesByGameId(gameId);
      const game = await findGamesById(gameId);

      return { statusCode: 200, body: { tables, game } };
    } catch (error) {
      return errorObject(error);
    }
  }

  async getTablePage(tableId) {
    try {
      const table = await findTableById(tableId);

      return { statusCode: 200, body: table };
    } catch (error) {
      return errorObject(error);
    }
  }
}

module.exports = new PagesService();
