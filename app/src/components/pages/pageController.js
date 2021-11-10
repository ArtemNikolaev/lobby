const pageService = require("./pageService");

class PageController {
  async getPage(req, res, next) {
    try {
      const data = await pageService.getPage(req.user.id);

      return res.json(data);
    } catch (error) {
      return next(error);
    }
  }

  async getLobbyPage(req, res, next) {
    try {
      const data = await pageService.getLobbyPage(req.params.gameId);

      return res.json(data);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new PageController();
