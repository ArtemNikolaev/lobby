const userService = require("../user/userService");
const gameService = require("../games/gameService");
const tableService = require("../tables/tableService");
const UserDto = require("../../dtos/userDto");
const CatchError = require("../../errors/catchError");

class PageService {
  async getProfilePage(id) {
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
      return tableService.getTableInfo(id);
    } catch (error) {
      throw new CatchError(error);
    }
  }
}

module.exports = new PageService();
