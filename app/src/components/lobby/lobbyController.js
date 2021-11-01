const UserDto = require("../../dtos/userDto");
const userService = require("../user/userService");

class LobbyController {
  async getProfile(req, res, next) {
    try {
      const user = await userService.getUser(req.user.id);
      const userDto = new UserDto(user);

      return res.json(userDto);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new LobbyController();
