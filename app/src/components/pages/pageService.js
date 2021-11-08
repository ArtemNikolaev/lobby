const CatchError = require("../../errors/catchError");
const UserDto = require("../../dtos/userDto");
const gameService = require("../games/gameService");
const userService = require("../user/userService");

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
}

module.exports = new PageService();
