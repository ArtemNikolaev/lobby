const gameService = require("./gameService");
const { CREATED } = require("../../helpers/statusCodes");

class GameController {
  async create(req, res, next) {
    try {
      const game = await gameService.create(req);

      return res.status(CREATED).json(game);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new GameController();
