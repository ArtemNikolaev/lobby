const gameService = require("./gameService");
const { CREATED } = require("../../helpers/statusCodes");
const WebSocket = require("ws");
const ws = new WebSocket(`ws://localhost:3000`);

class GameController {
  async create(req, res, next) {
    try {
      const game = await gameService.create(req);
      ws.send(JSON.stringify({ game, event: "addGame" }));

      return res.status(CREATED).json(game);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new GameController();
