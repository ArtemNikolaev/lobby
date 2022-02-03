const service = require("./service");
const { bodyValidator, idValidator } = require("../utils/validator");
const checkAuth = require("../utils/checkAuth");
const responseError = require("../utils/responseError");
const parseMultipartFormData = require("../utils/parseMultipartFormData");
const { createGameSchema, createTableSchema } = require("../schemas");

class GameController {
  async createGame(req, res, role) {
    try {
      req.body = await parseMultipartFormData(req);
      bodyValidator(createGameSchema, req);

      const { error } = checkAuth(req.headers.authorization, role);
      if (error) return responseError(res, error);

      const data = await service.createGame(req.body);

      res.status(201).json(data);
    } catch (error) {
      responseError(res, error);
    }
  }

  async deleteGame(req, res, role) {
    try {
      const gameId = req.params["0"].split("/")[1];
      idValidator(gameId);

      const { error } = checkAuth(req.headers.authorization, role);
      if (error) return responseError(res, error);

      await service.deleteGame(gameId);

      res.status(204).send();
    } catch (error) {
      responseError(res, error);
    }
  }

  async createTable(req, res, role) {
    try {
      bodyValidator(createTableSchema, req);

      const { payload, error } = checkAuth(req.headers.authorization, role);
      if (error) return responseError(res, error);

      const data = await service.createTable(req, payload);

      res.status(201).json(data);
    } catch (error) {
      responseError(res, error);
    }
  }

  async deleteTable(req, res, role) {
    try {
      const gameId = req.params["0"].split("/")[1];
      const tableId = req.params["0"].split("/")[3];
      idValidator(gameId, tableId);

      const { error } = checkAuth(req.headers.authorization, role);
      if (error) return responseError(res, error);

      await service.deleteTable(tableId);

      res.status(204).send();
    } catch (error) {
      responseError(res, error);
    }
  }
}

module.exports = new GameController();
