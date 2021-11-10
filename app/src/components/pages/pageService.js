const CatchError = require("../../errors/catchError");
const UserDto = require("../../dtos/userDto");
const gameService = require("../games/gameService");
const userService = require("../user/userService");
const tableService = require("../tables/tableService");

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

  async getLobbyPage(id) {
    try {
      const tables = await tableService.findByGameId(id);
      const game = await gameService.findById(id);

      return { tables, game };
    } catch (error) {
      throw new CatchError(error);
    }
  }
}

module.exports = new PageService();
