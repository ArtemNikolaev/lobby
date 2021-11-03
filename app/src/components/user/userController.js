const userService = require("./userService");

class UserController {
  async getUserRoom(req, res, next) {
    try {
      const data = await userService.getRoom(req.user.id);

      return res.json(data);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new UserController();
