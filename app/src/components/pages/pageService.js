const CatchError = require("../../errors/catchError");
const UserDto = require("../../dtos/userDto");
const gameService = require("../games/gameService");
const userService = require("../user/userService");
const tableService = require("../tables/tableService");
const inMemoryStorage = require("../../inMemoryStorage/inMemoryStorage");

class PageService {
  async getPage(id) {
    try {
      const user = await userService.getUser(id);
      const userDto = new UserDto(user);

      const games = await gameService.getAll();

      return { user: userDto, games };
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async getLobbyPage(gameId) {
    try {
      const tables = await tableService.findByGameId(gameId);
      const game = await gameService.findById(gameId);

      return { tables, game };
    } catch (error) {
      throw new CatchError(error);
    }
  }

  async getTablePage(id) {
    try {
      const table = await tableService.findGameAndTableById(id);

      const count = await inMemoryStorage.getPlayersCount(parseInt(id));

      return { table, count };
    } catch (error) {
      throw new CatchError(error);
    }
  }
}

module.exports = new PageService();
