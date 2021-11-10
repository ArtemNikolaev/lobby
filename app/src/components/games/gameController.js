const { CREATED, NO_CONTENT } = require("../../helpers/statusCodes");
const tableService = require("../tables/tableService");
const gameService = require("./gameService");

class GameController {
  async create(req, res, next) {
    try {
      const game = await gameService.create(req);

      return res.status(CREATED).json(game);
    } catch (error) {
      return next(error);
    }
  }

  async delete(req, res, next) {
    const { id } = req.params;
    try {
      await gameService.delete(id);

      return res.status(NO_CONTENT).send();
    } catch (error) {
      return next(error);
    }
  }

  async getTablesByGameId(req, res, next) {
    const { id } = req.params;

    try {
      const tables = await tableService.findByGameId(id);

      return res.json(tables);
    } catch (error) {
      return next(error);
    }
  }

  async createTable(req, res, next) {
    try {
      const table = await tableService.create(req);

      return res.status(CREATED).json(table);
    } catch (error) {
      return next(error);
    }
  }

  async deleteTable(req, res, next) {
    const { tableId, gameId } = req.params;

    try {
      await tableService.delete(tableId, gameId, req.user.id);

      return res.status(NO_CONTENT).send();
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new GameController();
