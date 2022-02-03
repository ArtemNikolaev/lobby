const service = require("./service");
const checkAuth = require("../utils/checkAuth");
const responseError = require("../utils/responseError");

class Controller {
  async getProfilePage(req, res, role) {
    try {
      const { payload, error } = checkAuth(req.headers.authorization, role);
      if (error) return responseError(res, error);

      const data = await service.getProfilePage(payload.id);

      res.json(data);
    } catch (error) {
      responseError(res, error);
    }
  }

  async getLobbyPage(req, res) {
    try {
      const { error } = checkAuth(req.headers.authorization);
      if (error) return responseError(res, error);

      const data = await service.getLobbyPage(req.params.id);

      res.json(data);
    } catch (error) {
      responseError(res, error);
    }
  }

  async getTablePage(req, res) {
    try {
      const { error } = checkAuth(req.headers.authorization);
      if (error) return responseError(res, error);

      const data = await service.getTablePage(req.params.id);

      res.json(data);
    } catch (error) {
      responseError(res, error);
    }
  }
}

module.exports = new Controller();
