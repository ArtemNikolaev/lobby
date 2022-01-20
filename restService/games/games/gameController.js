const tableService = require("./tableService");
const gameService = require("./gameService");

const buildResponse = require("../utils/buildResponse");

class GameController {
  async createGame(event) {
    const data = await gameService.create(event);

    return buildResponse(data);
  }

  async deleteGame(event) {
    const data = await gameService.deleteGame(event.pathParameters.gameId);

    return buildResponse(data);
  }

  async createTable(event) {
    const data = await tableService.create(event);

    return buildResponse(data);
  }

  async deleteTable(tableId) {
    const data = await tableService.deleteTable(tableId);

    return buildResponse(data);
  }
}

module.exports = new GameController();
