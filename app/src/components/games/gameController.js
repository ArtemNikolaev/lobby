const gameService = require("./gameService");
const { CREATED, NO_CONTENT } = require("../../helpers/statusCodes");
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

  async delete(req, res, next) {
    const { id } = req.params;
    try {
      await gameService.delete(id);
      ws.send(JSON.stringify({ id, event: "deleteGame" }));

      return res.status(NO_CONTENT).send();
    } catch (error) {
      return next(error);
    }
  }

  async getTablesByGameId(req, res, next) {
    const { id } = req.params;
    try {
      let tables = await gameService.findTablesByGameId(id);

      return res.json(tables);
    } catch (error) {
      return next(error);
    }
  }

  async createTable(req, res, next) {
    try {
      const table = await gameService.createTable(req);
      ws.send(
        JSON.stringify({
          table,
          event: "createTable",
        })
      );

      return res.status(CREATED).json(table);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new GameController();
