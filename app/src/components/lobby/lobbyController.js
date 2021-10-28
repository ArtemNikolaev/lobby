const userService = require("../user/userService");

class LobbyController {
  async getProfile(req, res, next) {
    try {
      const user = await userService.getUser(req.user.id);

      return res.json(user);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new LobbyController();
