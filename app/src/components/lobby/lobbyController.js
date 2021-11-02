const UserDto = require("../../dtos/userDto");
const gameService = require("../games/gameService");
const userService = require("../user/userService");

class LobbyController {
  async getLobbyRoom(req, res, next) {
    try {
      const user = await userService.getUser(req.user.id);
      const userDto = new UserDto(user);

      const games = await gameService.getAll();

      return res.json({ user: userDto, games });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new LobbyController();
